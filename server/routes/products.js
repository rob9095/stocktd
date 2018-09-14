const express = require('express');
const router = express.Router();
const { processProductImport, getProducts, updateProducts } = require('../handlers/products');

router.post('/import-csv', processProductImport);
router.post('', getProducts)
router.post('/update', updateProducts)

module.exports = router;
