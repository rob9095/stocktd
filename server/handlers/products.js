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
		let productsUpdated = [];
		let productsAdded = [];
		let importErrors = [];
		for (let p of jsonProducts) {
			let foundProduct = await db.Product.findOne({sku: p.sku})
			if (foundProduct) {
				if (req.body.update === true) {
					foundProduct.set(p)
					foundProduct.save();
					productsUpdated.push(foundProduct)
				} else {
					importErrors.push({...p, error: 'Product already exists'})
				}
			} else {
				let createdProduct = await db.Product.create({...p, company:req.body.company})
				if (createdProduct) {
					productsAdded.push(createdProduct)
				} else {
					importErrors.push({...p, error: 'Unable to add product'})
				}
			}
		}
    return res.status(200).json({
			productsAdded,
			productsUpdated,
			importErrors,
		})
	} catch(err) {
		return next(err);
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		console.log(req.body)
		let products = await db.Product.find({company: req.body.company})
		return res.status(200).json({products})
	} catch(err) {
		return next(err);
	}
}
