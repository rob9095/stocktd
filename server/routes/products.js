const express = require('express');
const router = express.Router();
const { processProductsCSV } = require('../handlers/products');

router.post('/import-csv', processProductsCSV);

module.exports = router;
