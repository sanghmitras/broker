var express = require('express');
var router = express.Router();
const modal = require('../modal/modal');
 

/* GET users listing. */
router.get('/test-suit', function(req, res, next) {
  modal.GetTestSuit().then(resp=>{
    // console.log('result', resp)
    res.send(JSON.stringify(resp))
    res.status(200)
    res.end()
  }).catch(err=>{
    console.log('error', err)
    res.send({data: err})
    res.status(500)
    res.end()
  })

});

module.exports = router;
