const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({
    message: 'You are accessing the v2 API!',
  });
});

module.exports = router;
