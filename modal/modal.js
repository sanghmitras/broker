var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'byjus_elevate'
});

connection.connect();

function GetTestSuit(){
    return new Promise((resolve, reject)=>{
        let q = 'SELECT * FROM batch_grades'
        connection.query(q, (error, result, fields)=>{
            if(error) reject(error);
            resolve(result);
        })
    })
}

module.exports = {GetTestSuit}