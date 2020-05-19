var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "deepika-0507",
  password: "deepika@1999"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE sampledata", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });


  var sql = "CREATE TABLE sample_data (firstname VARCHAR(255), secondname VARCHAR(255), place VARCHAR(255), suraname VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });


  var sql = "INSERT INTO customers (firstname, secondname, place, suraname) VALUES ?";
  var values = [
    ['John', 'peter', 'Usa', 'Antony'],
    ['Amy', 'Hannah', 'Canada', 'Parker'],
    ['Michael', 'Sandy', 'Ireland','Beth'],
    ['Betty', 'Richard' ,'Sri Lanka', 'Ben'],
    
  ];
    con.query(sql, [values] ,function (err, result) {
    if (err) throw err;
    console.log("inserted");
  });




  var sql = "UPDATE customers SET secondname = 'Deepika' WHERE secondname = 'Ben'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " updated");
  });




  var sql = "DELETE FROM customers WHERE secondname = 'Deepika'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("deleted: " + result.affectedRows);
  });
});