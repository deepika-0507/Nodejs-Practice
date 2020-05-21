const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const Dataschema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    age:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    },
  



})


module.exports=mongoose.model('data',Dataschema);
