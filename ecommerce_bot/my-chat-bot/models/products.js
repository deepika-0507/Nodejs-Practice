const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


const Product = new mongoose.Schema({
    name:{
        type:String,
    },
    type:{
        type:String,
    },
    Colors:{
        type:String,
    },
    properties:{
        type:String,
    },

})

const Products = mongoose.model('Products',Product)

module.exports = Products