const express = require('express');
const router = express.Router();

const verificationsController = require('../controllers/verifications');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/verify', verificationsController.verifyEmail);

module.exports = router;
