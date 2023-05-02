var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "w_poc",
});

connection.connect();

function GetTestSuit() {
  return new Promise((resolve, reject) => {
    let q = "SELECT * FROM batch_grades";
    connection.query(q, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}
function GetTestByID(id) {
  return new Promise((resolve, reject) => {
    let q = `SELECT *, test_case.name as 'test_case_name' FROM test_case INNER JOIN test_suite ON test_suite.id = test_case.fk_test_suite WHERE req_id='${id}';`;
    connection.query(q, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

module.exports = { GetTestSuit, GetTestByID };
