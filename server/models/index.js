const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/stoctopus', {
	keepAlive: true
});

module.exports.User = require('./user');
module.exports.Company = require('./company');
