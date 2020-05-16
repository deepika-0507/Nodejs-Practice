const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/sampledata";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var database = db.db("sampledata");
  database.createCollection("sample_data",function(err,doc){
      if(err) throw err;
      console.log("created");
      db.close()
  })
  var data = [
      {firstname:'Sam',secondname:'Andrew',year:'2010',age:'30',gender:'male',country:'India'},
      {firstname:'Sai',secondname:'Gupta',year:'2011',age:'21',gender:'male',country:'Sri Lanka'},
      {firstname:'John',secondname:'Wells',year:'1999',age:'11',gender:'male',country:'Canada'},
      {firstname:'Sheldom',secondname:'Cooper',year:'2013',age:'9',gender:'male',country:'Usa'}
  ]
  database.collection("sample_data").insertMany(data,function(err,doc){
      if(err) throw err;
      console.log(doc.ops)
      db.close()
      
  })

  database.collection("sample_data").deleteOne({year:'2010'},function(err,doc){
      if(err) throw err;
      console.log(doc.result)
      db.close()
  })

  var new_data = {$set: {year:'2020'}};
  database.collection("sample_data").updateOne({year:'2011'},new_data,function(err,doc){
      if(err) throw err;
      console.log(doc.result)
      db.close()
  })
});