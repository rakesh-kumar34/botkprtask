/* Module dependencies.*/
const fetch = require('node-fetch');
const express = require('express');

// Create new app in express
var app = express();

// Use custom port or port 3000 as deafult
const port = process.env.PORT || 3000;


/* Async functions to fetch Products and Inventory.*/

async function getAllProducts() {
    const res = await fetch('http://autumn-resonance-1298.getsandbox.com/products');
    return { products: await res.json(), found: res.status === 200 };
}
  
async function getProductByName(name) {
    const res = await fetch(`http://autumn-resonance-1298.getsandbox.com/products/${name}`);
    return { product: await res.json(), found: res.status === 200 };
}

async function getInventoryByName(name) {
    const res = await fetch(`http://autumn-resonance-1298.getsandbox.com/inventory/${name}`);
    return { inventory: await res.json(), found: res.status === 200 };
}

// Set port for all environments
app.set('port', process.env.PORT || 3000);

/* Endpoint to get all of the products along with each products inventory. 
It returns an array of products that include the product's name, price and inventory */
app.get('/getAllProductDetails', async (req, res, next) => {
    try {
        const productsData = await getAllProducts();

        if (!productsData.found) {
            res.status(400).send("Invalid Request");
            return;
        }

        var productDetails = [];
        for (const product of productsData.products) {
            const inventoryData = await getInventoryByName(product.name);
            const obj = Object.assign({}, product, {
                inventory: inventoryData.inventory.inventory[0].inventory
            });

            //console.log(obj);
            productDetails.push(obj);
        }
        res.send(productDetails);
    } catch (err) {
        res.status(500).send("GET/ Request failed with status code 500");
    }
});

/* Endpoint for the user to get a single product and have it return the product name, price and inventory. */
app.get('/getAllProductDetails/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const productData = await getProductByName(name);

        const inventoryData = await getInventoryByName(name);

        var productDetail = [];
        const obj = Object.assign({}, productData.product.product[0], {
            inventory: inventoryData.inventory.inventory[0].inventory
        });

        productDetail.push(obj);
        res.send(productDetail);
    } catch (err) {
        res.status(400).send("Invalid Request");
        //console.log(e);
    }
});

// Listening to Server at custom port or deafult port 3000
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});