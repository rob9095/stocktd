const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/stoctopus', {
	keepAlive: true
});

module.exports.User = require('./user');
module.exports.Company = require('./company');
module.exports.Company = require('./integration');
module.exports.Company = require('./boxScan');
module.exports.Company = require('./product');
module.exports.Company = require('./location');
module.exports.Company = require('./poProduct');
module.exports.Company = require('./purchaseOrder');
module.exports.Company = require('./order');
module.exports.Company = require('./orderProduct');
