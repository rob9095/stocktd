const db = require('../models');
const csv = require('csvtojson');

exports.processProductsCSV = async (req, res, next) => {
	req.setTimeout(9999999);
	try {
    if (!req.files) {
      return next({
        status: 400,
        message: 'No file uploaded'
      })
    }
    let file = req.files.productcsv;
    file.mv(`${__dirname}/test.csv`)
    const jsonProducts = await csv().fromFile(`${__dirname}/test-sm.csv`)
		if (req.body.update) {
			// slow on large arrs
			// let companyProducts = await db.Product.find({company: req.body.company})
			// let products = jsonProducts.map(p => {
			// 	if (companyProducts.some(({sku}) => sku === p.sku)){
			// 		return {
			// 			updateOne: {
			// 				filter: { skuCompany: `${p.sku}-${req.body.company}`},
			// 				update: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
			// 			}
			// 		}
			// 	} else {
			// 		return {
			// 			insertOne: {
			// 				document: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
			// 			}
			// 		}
			// 	}
			// })
			let products = jsonProducts.map(p => ({
				updateOne: {
					filter: { skuCompany: `${p.sku}-${req.body.company}`},
					update: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
				}
			}))
			let updatedProducts = await db.Product.bulkWrite(products)
			return res.status(200).json(updatedProducts)
		} else {
			await db.Product.insertMany(products, function(error, productsAdded) {
				if(error) {
					return next({
						status: 400,
						message: error,
					})
				} else {
					return res.status(200).json(productsAdded)
				}
			});
		}
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
