const db = require('../models');

exports.verifySignUpToken = async function(req, res, next) {
	try {
    if (!req.params.token_id.match(/^[0-9a-fA-F]{24}$/)) {
      return next({
        status: 400,
        message: 'Unable to verify user'
      })
    }
    let token = await db.SignUpToken.findOne({_id: req.params.token_id})
    if (token) {
      // update user and remove token
      let user = await db.User.findOne({email: token.email})
      if (user) {
        user.emailVerified = true;
        await user.save();
        await token.remove();
        return res.status(200).json({
          message: `Thanks for verifying your email`
        });
      }
    } else {
      return next({
        status: 400,
        message: 'Unable to verify user'
      })
    }
	} catch(err) {
		return next(err);
	}
};
