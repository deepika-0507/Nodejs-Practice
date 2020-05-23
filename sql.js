const mysql = require('mysql')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const json = bodyParser.json({ extended: false })

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "deepika@1999",
    database:'data'
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

  });




  app.post('/post',json,function(req,res){
    var sql = "INSERT INTO sampledata (name,place) VALUES ?";
    var x = req.body
    console.log(Object.keys(x).length)
    var arr=[   [x.data1.name,x.data1.place],
                [x.data2.name,x.data2.place],
                [x.data3.name,x.data3.place],
                [x.data4.name,x.data4.place],
                [x.data5.name,x.data5.place],
                [x.data6.name,x.data6.place],
                [x.data7.name,x.data7.place],
                [x.data8.name,x.data8.place],
                [x.data9.name,x.data9.place],
                [x.data10.name,x.data10.place],
            ]

    console.log(arr)
    
    con.query(sql, [arr] ,function (err, result) {
        if (err) throw err;
        console.log(result)
        console.log("inserted");
      });
    res.json('submitted')
    
  })




app.get('/get',function(req,res){
    var sql = "SELECT * FROM sampledata"
    con.query(sql, function (err, result,fields) {
        if (err) throw err;
        console.log(result);
      });
})


app.put('/put',function(req,res){
    var sql = "UPDATE sampledata SET name = 'Ben' WHERE name = 'deepika'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " updated");
      });
})


app.delete('/delete',function(req,res){
    var sql = "DELETE FROM sampledata WHERE name = 'sowmya'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("deleted: " + result.affectedRows);
    });
})

app.listen('3000', ()=>{
    console.log('starting');
    
  })