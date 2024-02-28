const URL = 'https://newsapi.org/v2/everything?q=clothes&page=1&pageSize=12&sortBy=publishedAt&apiKey=';
const API_KEY = '67a14609965043f8a11737304bb37d60';
const axios = require('axios');

async function getNews() {
    try {
        const response = await axios.get(URL + API_KEY);
        return response.data.articles;
    } catch (error) {
        console.error("[Error] Failed to fetch news from newsapi.org, error: ", error);
        return [];
    }
}

module.exports = { getNews };
