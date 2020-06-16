const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


const User = new mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:Number
    },
    transport:{
        type:String
    },

})

const Users = mongoose.model('Users',User)

module.exports = Users