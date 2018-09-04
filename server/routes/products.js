const express = require('express');
const router = express.Router();
const { processProductImport, getProducts } = require('../handlers/products');

router.post('/import-csv', processProductImport);
router.post('', getProducts)

module.exports = router;
