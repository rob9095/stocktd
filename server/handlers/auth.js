const db = require('../models');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/sendEmail');
const verificationEmail = {
	from: 'noreply@stocktd.com',
	subject: 'Please confirm your email',
}
const emailStyles = `
<style>
	@import url('https://fonts.googleapis.com/css?family=Dosis:400,700');
	@import url('https://fonts.googleapis.com/css?family=Lato:400,700');
	.email-verify-container h2 {
		font-family: Dosis;
		font-size: xx-large;
	}
	.email-verify-container p {
    line-height: 30px;
    color: #5c5c5c;
    font-size: 16px;
	}
	.email-verify-container {
		max-width: 500px;
		margin: 0 auto;
		text-align: center;
	}
	.ui.teal.button {
			background-color: #3fd1c4;
			color: #fff;
			text-shadow: none;
			background-image: none;
			font-size: 1.42857143rem;
			-webkit-box-shadow: 0 0 0 0 rgba(34,36,38,.15) inset;
			box-shadow: 0 0 0 0 rgba(34,36,38,.15) inset;
			border: 1px solid #3fd1c4;
			border-radius: 5px;
			cursor: pointer;
			font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
			padding: .78571429em 1.5em .78571429em;
			font-weight: 700;
			font-size: large;
	}
	.ui.teal.button: hover {
		background-color: #28cec0 !important;
	}
</style>
`

exports.signin = async function(req, res, next) {
	try {
		let user = await db.User.findOne({
			email: req.body.email
		});
		let { id, username, company } = user;
		let isMatch = await user.comparePassword(req.body.password);
		if(isMatch){
			let token = jwt.sign(
			{
				id,
				username,
				company
			},
				process.env.SECRET_KEY
			);
			return res.status(200).json({
				id,
				username,
				company,
				token
			});
		} else {
			return next({
				status: 400,
				message: 'Invalid email or password'
			})
		}
	} catch(err) {
		return next({
			status: 400,
			message: 'Invalid email or password'
		})
	}
};

exports.signup = async function(req, res, next) {
	try {
		// first check for empty values
		let reqValues = ['email', 'password', 'company']
		let values = Object.entries(req.body)
		let errors = [];
		for (let val of values) {
			if (val[1] === '' || val[1].length <= 0) {
				if (reqValues.includes(val[0])) {
					errors.push({
						input: val[0],
						value: val[1],
						message: `Please enter a valid ${val[0]}`
					})
				}
			}
		}
		if (errors.length > 0) {
			return next({
				status: 400,
				message: 'Please fill in the required inputs',
			})
		}
		// second check for password length, email is validated in user schema
		if (req.body.password.length < 6) {
			return next({
				status: 400,
				message: 'Password must be at least 6 characters',
			})
		}
		// check the email and company name are open
		let foundUser = await db.User.findOne({email: req.body.email})
		let foundCompany = await db.Company.findOne({name: req.body.company})
		if (foundUser) {
			return next({
				status: 400,
				message: 'Email already exists',
			})
		} else if (foundCompany) {
			return next({
				status: 400,
				message: 'Company already exists',
			})
		}
		// create the company
		let createdCompany = await db.Company.create({
			name: req.body.company,
		})
		// create the user
		let userInfo = {
			...req.body,
			emailVerified: false,
		}
		let user = await db.User.create(userInfo);
		createdCompany.users.push(user._id)
		user.companyId = createdCompany._id
		user.save();
		createdCompany.save();
		let { id, username, company } = user;
		let token = jwt.sign(
		{
			id,
			username,
			company
		},
		process.env.SECRET_KEY
		);
		// create the signup token
		let signUpToken = await db.SignUpToken.create({email: req.body.email})
		//send the verification email
		let emailRes = sendEmail({
			...verificationEmail,
			to: req.body.email,
			html: `
				${emailStyles}
				<div class="email-verify-container">
					<h2>Welcome to stocktd</h2>
					<p>Please click the link below to confirm your email address</p>
					<a href="https://stocktd.com/verify-email/${signUpToken._id}"><button class="ui teal button">Confirm my email</button></a>
					<p>Have some questions? <a href="#">Contact Us</a></p>
				</div>
			`,
		})

		return res.status(200).json({
			id,
			username,
			company,
			token
		});
	} catch(err) {
		if(err.code === 11000) {
			console.log(err)
			err.message = 'Sorry, that email and/or company has been taken.'
		}
		return next({
			status:400,
			message: err.message
		});

	}
};
