const express = require('express');
const app = express();
const route = require('./src/routes/route.js');

app.use(express.json());
app.use('/api/v1', route);

module.exports = app;