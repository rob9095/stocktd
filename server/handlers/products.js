const db = require('../models');

exports.processProductImport = async (req, res, next) => {
	//req.setTimeout(9999999);
	try {
		if (req.body.company)
		if(req.body.update) {
			let products = req.body.products.map(p => ({
				updateOne: {
					filter: { skuCompany: `${p.sku}-${req.body.company}`},
					update: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
					upsert: true,
				}
			}))
			let updatedProducts = await db.Product.bulkWrite(products)
			return res.status(200).json(updatedProducts)
		} else {
			let products = req.body.products.map(p => ({
				insertOne: {
					document: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
				}
			}))
			let addedProducts = await db.Product.bulkWrite(products)
			return res.status(200).json(addedProducts)
		}
	} catch(err) {
		if(err.code === 11000) {
			console.log(err)
			err.message = 'Duplicate SKUs found. Please update instead.'
		}
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
