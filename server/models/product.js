const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  skuCompany: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  weightType: {
    type: 'String',
  },
  boxScans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
  }],
  companyName: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
