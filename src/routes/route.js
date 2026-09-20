const express = require('express');
const route = express.Router();
const { postOriginalUrl, retrieveURL, updateURL, deleteURL, getURLstats } = require('../controller/itemController');

route.post('/shorten', postOriginalUrl);
route.get('/shorten/:shortCode', retrieveURL);
route.get('/shorten/:shortCode/stats', getURLstats);
route.put('/shorten/:shortCode', updateURL)
route.delete('/shorten/:shortCode', deleteURL)

module.exports = route;