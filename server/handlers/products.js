const db = require('../models');

exports.processProductImport = async (req, res, next) => {
	try {
		if(req.body.update) {
			let updates = req.body.products.json.map(p => ({
				updateOne: {
					filter: { skuCompany: `${p.sku}-${req.body.company}`},
					update: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
					upsert: true,
				}
			}))
			let updatedProducts = await db.Product.bulkWrite(updates)
			let products = await db.Product.find({company: req.body.company})
			return res.status(200).json(updatedProducts, products)
		} else {
			let inserts = req.body.products.json.map(p => ({
				insertOne: {
					document: {...p, company: req.body.company, skuCompany: `${p.sku}-${req.body.company}`},
				}
			}))
			let addedProducts = await db.Product.bulkWrite(inserts)
			let products = await db.Product.find({company: req.body.company})
			return res.status(200).json(addedProducts, products)
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
		let count = await db.Product.count({company: req.body.company})
		const limit = req.body.rowsPerPage
		const skip = (req.body.activePage * req.body.rowsPerPage) - req.body.rowsPerPage
		const totalPages = Math.floor(count / req.body.rowsPerPage)
		let products = await db.Product.find({company: req.body.company}).skip(skip).limit(limit)
		return res.status(200).json({
			products,
			totalPages,
			skip,
			activePage: req.body.activePage,
			rowsPerPage: req.body.rowsPerPage,
		})
	} catch(err) {
		return next(err);
	}
}
