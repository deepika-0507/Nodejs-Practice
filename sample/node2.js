const data = require('./models/data2')
const express = require('express')
const app = express()
const router = express.Router();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


mongoose.connect("mongodb://localhost:27017/sampledata",{useNewUrlParser: true,useUnifiedTopology: true});


app.set('view engine','ejs');


app.get('/form_submit',function(req,res){
    res.render('form1')
})

app.post('/form_submit',urlencodedParser,function(req,res){
    console.log(req.body.name)
    var new_data = data();
    new_data.name = req.body.name
    new_data.age = req.body.age
    new_data.year = req.body.year
    new_data.gender = req.body.gender
    new_data.save((err,doc)=>{
        if(err) throw err;
        console.log(doc)
        console.log('submited')
    })
    res.json('submitted')
})



app.put('/put',function(req,res){
    console.log('put')
    data.findOneAndUpdate({name:'xyz'},{name:'deepika'},(err,docs)=>{
        if(err) throw err;
        console.log(docs)
        res.json(docs)
    })
})



app.delete('/delete',function(req,res){
    data.findOneAndDelete({name:'deepika'},function(err,docks){
        if(err) throw err;
        console.log(docks)
        res.json(docks)
    })

})

app.listen('3003', ()=>{
    console.log('starting');
    
})
