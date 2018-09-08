const express = require('express');
const router = express.Router();
const { processPurchaseOrderImport, getCompanyPurchaseOrders } = require('../handlers/purchaseOrders');

router.post('/import-csv', processPurchaseOrderImport);
router.post('/', getCompanyPurchaseOrders);

module.exports = router;
