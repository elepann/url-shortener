const express = require('express');
const route = express.Router();
const { postOriginalUrl } = require('../controller/itemController');

route.post('/shorten', postOriginalUrl);

module.exports = route;