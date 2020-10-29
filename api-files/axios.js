const axios = require("axios");
require("dotenv").config({ path: __dirname + "/../.env" });

const instance = axios.create({
  baseURL: "https://na1.api.riotgames.com/lol",
  params: { api_key: process.env.API_KEY },
});

module.exports = instance;
