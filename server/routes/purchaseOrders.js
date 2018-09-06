const express = require('express');
const router = express.Router();
const { processPurchaseOrderImport } = require('../handlers/purchaseOrders');

router.post('/import-csv', processPurchaseOrderImport);

module.exports = router;
