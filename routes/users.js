var express = require("express");
var router = express.Router();
const fs = require("fs");
// const modal = require('../modal/modal');

/* GET users listing. */
router.get("/test-suit", function (req, res, next) {
  fs.readFile("../broker/public/test_suit.json", "utf8", function (err, data) {
    if (err) throw err;

    var resultArray = data;
    // console.log("result", data);
    res.send(resultArray);
  });
  // modal.GetTestSuit().then(resp=>{
  //   // console.log('result', resp)
  //   res.send(JSON.stringify(resp))
  //   res.status(200)
  //   res.end()
  // }).catch(err=>{
  //   console.log('error', err)
  //   res.send({data: err})
  //   res.status(500)
  //   res.end()
  // })
});

router.get("/test-hierarchy", function (req, res, next) {
  fs.readFile(
    "../broker/public/dir_hierarchy.json",
    "utf8",
    function (err, data) {
      if (err) throw err;

      var resultArray = data;
      // console.log("result", data);
      res.send(resultArray);
    }
  );
});

module.exports = router;
