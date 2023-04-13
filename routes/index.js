var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const index = path.join(path.resolve(__dirname, ".."), "public", "index.html");
  res.sendFile(index);
});

// router.get('/api/')

module.exports = router;
