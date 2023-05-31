var express = require("express");
var router = express.Router();
const fs = require("fs");
const shell = require("python-shell");
// const model = require("../model/model");
const path = require("path");
const child_process = require('child_process');
var SSH = require('simple-ssh');
const { Client } = require('ssh2');
const { connectViaSSH2 } = require('../controller/index')

/* GET users listing. */
router.get("/test-suit", function (req, res, next) {
  fs.readFile("./w_poc_2/test_suit.json", "utf8", function (err, data) {
    if (err) throw err;

    var resultArray = data;
    // console.log("result", data);
    res.send(resultArray);
  });
  // model.GetTestSuit().then(resp=>{
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
  // ExecuteShell("ls -l")
  fs.readFile("./w_poc_2/dir_hierarchy.json", "utf8", function (err, data) {
    if (err) throw err;

    var resultArray = data;
    // console.log("result", data);
    res.send(resultArray);
  });
});

router.post("/test-case-by-id", function (req, res, next) {
  console.log("environemt variable", process.env.PORT);
  if (req.body["type"] === "suit") {
    fs.readFile("./w_poc_2/dir_hierarchy.json", function (err, data) {
      if (err) throw err;
      let test_case_data = null;
      let req_item = req.body["id"];
      test_case_data = JSON.parse(data);
      let test_cases = test_case_data[req_item];
      res.status(200);
      res.send({ data: Object.keys(test_cases) });
    });
  }
  if (req.body["type"] === "req_id") {
    fs.readFile("./w_poc_2/reqID_mapping.json", "utf-8", function (err, data) {
      if (err) throw err;
      let test_case_data = null;
      let req_item = req.body["id"];
      if (req.body["type"] == "req_id") {
        test_case_data = JSON.parse(data);
        let test_cases = test_case_data[req_item];
        // console.log("test case ", test_cases);
        res.status(200);
        let resultFields = [];
        let resultArray = [];
        fs.readFile(
          path.join(__dirname, "../w_poc_2/dir_hierarchy.json"),
          "utf8",
          function (err, data) {
            if (err) throw err;

            let brokerData = JSON.parse(data);
            let allTestSuit = Object.keys(brokerData);

            allTestSuit.map((suit, index) => {
              let allTestCase = Object.keys(brokerData[suit]);
              allTestCase.map((Testcase) => {
                // let ValueOfTestCase = Object.values(brokerData[suit][Testcase]);

                if (brokerData[suit][Testcase]["req_id"] == req_item) {
                  // console.log(
                  //   '(brokerData[suit][Testcase]["req_id"] == req_item',
                  //   brokerData[suit][Testcase]["req_id"] == req_item,
                  //   brokerData[suit][Testcase]["req_id"],
                  //   req_item,
                  //   {
                  //     id: index,
                  //     name: suit,
                  //     req_id: req_item,
                  //     test_case_name: Testcase,
                  //   }
                  // );
                  resultFields.push({
                    id: index,
                    name: suit,
                    req_id: req_item,
                    test_case_name: Testcase,
                  });
                }
              });
            });
            // console.log("allTestSuit", allTestSuit);
            // console.log("resut>>>>", resultFields);
            res.send({ data: test_cases, data2: resultFields });
          }
        );

        // model
        //   .GetTestByID(req_item)
        //   .then((result) => {
        //     console.log("result", result);
        //     res.send({ data: test_cases, data2: result });
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //   });
        // test_cases = test_cases.map(Tcase=>{
        //   test_suits = Object.keys(JSON.parse(data)[1])
        //   test_suits.map(suite_name=>{
        //     test_case_name = JSON.parse(data)[1][suite_name]

        //   })
        // })
      }
    });
  }
});
const ExecuteShell = async (command) => {
  //   console.log('executing function')
  //   var ssh = new SSH({
  //     host: 'localhost',
  //     user: 'username',
  //     pass: 'password'
  // });

  // ssh.exec('echo $PATH', {
  //   out: function(stdout) {
  //       console.log(stdout);
  //   }
  // }).start();

  // child_process.exec(command, (error, stdout, stderr) => {
  //   if (error !== null) {
  //     console.log("exec err", error)
  //   }
  //   console.log("Stdout", stdout);
  //   console.log("stderr", stderr);
  // })

  const conn = new Client();
  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('uptime', (err, stream) => {
      if (err) throw err;
      stream.on('close', (code, signal) => {
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        conn.end();
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    host: '127.0.0.1',
    port: 22,
    username: 'sanghmitra',
  });
}
router.post("/kick-start", function (req, res, next) {
  connectViaSSH2()
  const Script_base_address = path.join(
    __dirname,
    `../${process.env.NODE_SCRIPT_BASE_ADDRESS}`
  );
  let options = {};
  let result = [];
  (req.body.selectedTest || []).map((items, index) => {
    options = {
      mode: "text",
      // pythonPath:  `${path.resolve(__dirname, '/w_poc_2/main.py')}`,
      pythonOptions: ["-u"], // get print results in real-time
      scriptPath: `${Script_base_address}/${items.suit}/${items.testCase}`,
    };

    shell.PythonShell.run("test.py", options)
      .then((message) => {
        let date = new Date();
        result.push({
          suit: items.suit,
          testCase: items.testCase,
          result: message,
          date: date.toString(),
        });

        if (index === req.body.selectedTest.length - 1) {
          fs.writeFile(
            path.join(__dirname, "../w_poc_2/result.json"),
            JSON.stringify(result),
            "utf8",
            (r) => {
              console.log("write is done", r);
            }
          );
          res.status(200);
          res.end();
        }
      })
      .catch((err) => {
        console.log("error in execution", err);
        res.end();
      });
  });
});

router.get("/test-result", function (req, res, next) {
  fs.readFile("./w_poc_2/result.json", "utf8", function (err, data) {
    if (err) throw err;

    var resultArray = data;
    res.send(resultArray);
  });
});
module.exports = router;
