const express = require('express');
const router = express.Router();
const { processPurchaseOrderImport, getCompanyPurchaseOrders, getPoProducts } = require('../handlers/purchaseOrders');

router.post('/', getCompanyPurchaseOrders);
router.post('/import-csv', processPurchaseOrderImport);
router.post('/products', getPoProducts);

module.exports = router;
