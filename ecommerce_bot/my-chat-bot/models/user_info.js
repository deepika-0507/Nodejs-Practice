const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


const Userinfo = new mongoose.Schema({
    email:{
        type:String,
    },
    password:{
        type:String,
    },


})

const UserInfo = mongoose.model('UserInfo',Userinfo)

module.exports = UserInfo