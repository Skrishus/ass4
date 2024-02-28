const axios = require("axios");

async function fetchProducts() {
    try {
        const response = await axios.get("https://fakestoreapi.com/products");
        return response.data;
    } catch (error) {
        console.error("[Error] fetchProducts failed, err: ", error);
        return [];
    }
}

module.exports = { fetchProducts };
