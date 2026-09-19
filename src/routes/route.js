const express = require('express');
const route = express.Router();
const { postOriginalUrl, retrieveURL, updateURL, deleteURL } = require('../controller/itemController');

route.post('/shorten', postOriginalUrl);
route.get('/shorten/:shortCode', retrieveURL);
route.put('/shorten/:shortCode', updateURL)
route.delete('/shorten/:shortCode', deleteURL)

module.exports = route;