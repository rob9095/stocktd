const mongoose = require('mongoose');

const PoProductSchema = new mongoose.Schema({
  poId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
  },
  poName: {
    type: String,
  },
  poSku: {
    type: String,
  },
  poProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  poProductQuantity: {
    type: Number,
  },
  poProductScannedQuantity: {
    type: Number,
    default: 0,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
  lastScan: {
    type: Date,
    default: Date.now(),
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const PoProduct = mongoose.model("PoProduct", PoProductSchema);

module.exports = PoProduct;
