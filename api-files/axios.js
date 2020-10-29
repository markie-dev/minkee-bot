const axios = require('axios');
require('dotenv').config({path: __dirname + '/../.env'});

const instance = axios.create( {
    baseURL: 'https://na1.api.riotgames.com/lol',
    params: {api_key: RGAPI-ff8251e1-c23c-46d3-a3c7-6d66de7bd7fa},
});

module.exports = instance;