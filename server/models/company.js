const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    required: true,
    default: "Free",
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
  }],
  warehouseType: {
    type: String,
    required: true,
    default: "simple",
  }
})

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
