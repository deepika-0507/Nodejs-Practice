const express = require('express')
const app = express()
const sampledata = require('./models/sampledata')
const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/sampledata",{   useNewUrlParser: true,useUnifiedTopology: true});

app.set('view engine','ejs');

app.get('/form',function(req,res){
    res.render('form')
    console.log(req.body)
})


app.get('/form/data',function(req,res){
    console.log('data')
    sampledata.find({},function(err,doc){
        if(err) throw err;
        console.log(doc)
        res.json(doc)
        console.log('entered')
    })
})

app.post('/form',function(req,res){
    console.log(req.body)
    res.send('submitted')

})


app.listen('3001', ()=>{
    console.log('running');
})