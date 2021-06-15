const express = require('express');

const router = express.Router();
const TokenRouter = require('./token');

router.use('/token', TokenRouter);

module.exports = router;
