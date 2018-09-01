const express = require('express');
const router = express.Router();
const { processProductsCSV, getProducts } = require('../handlers/products');

router.post('/import-csv', processProductsCSV);
router.post('', getProducts)

module.exports = router;
