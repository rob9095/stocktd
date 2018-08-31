const db = require('../models');
const csv = require('csvtojson');

exports.processProductsCSV = async (req, res, next) => {
	try {
    if (!req.files) {
      return next({
        status: 400,
        message: 'No file uploaded'
      })
    }
    let file = req.files.productcsv;
    file.mv(`${__dirname}/test.csv`)
    const jsonProducts = await csv().fromFile(`${__dirname}/test.csv`)
    console.log(jsonProducts)
    return res.status(200).json(jsonProducts)
	} catch(err) {
		return next(err);
	}
};
