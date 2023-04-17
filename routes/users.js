var express = require("express");
var router = express.Router();
const fs = require("fs");
const shell = require("python-shell");
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

router.post("/test-case-by-id", function (req, res, next) {
  fs.readFile("../broker/w_poc/output.json", "utf-8", function (err, data) {
    if (err) throw err;
    let test_case_data = null;
    let req_item = req.body["id"];
    if (req.body["type"] == "req_id") {
      test_case_data = JSON.parse(data)[0];
      let test_cases = test_case_data[req_item];
      console.log("test case ", test_cases);
      res.status(200);
      res.send({ data: test_cases });
    }
    if (req.body["type"] == "suit") {
      test_case_data = JSON.parse(data)[1];
      let test_cases = test_case_data[req_item];
      res.status(200);
      res.send({ data: Object.keys(test_cases) });
    }
  });
});

router.get("/kick-start", function (req, res, next) {
  console.log("kick off running");
  let options = {
    mode: "text",
    pythonPath: "path/to/python",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "path/to/my/scripts",
    args: ["value1", "value2", "value3"],
  };
  shell.PythonShell.run("", null).then((message) => {
    console.log("finished", message);
    res.status(200);
    res.end();
  });
});

module.exports = router;
