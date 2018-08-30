const express = require('express');
const router = express.Router();
const { verifySignUpToken } = require('../handlers/account');

router.post('/verify/:token_id', verifySignUpToken);

module.exports = router;
