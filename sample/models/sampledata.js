const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const Sampledataschema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    secondname:{
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
    country:{
        type:String,
        required:true
    },



})


module.exports=mongoose.model('sampledata',Sampledataschema);
