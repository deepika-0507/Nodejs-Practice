const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


const Order = new mongoose.Schema({
    email:{
        type:String,
    },
    product:{
        type:String,
    },
    color:{
        type:String,
    },
    address:{
        type:String,
    },


})

const Orders = mongoose.model('Orders',Order)

module.exports = Orders