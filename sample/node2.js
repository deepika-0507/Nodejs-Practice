const data = require('./models/data2')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


mongoose.connect("mongodb://localhost:27017/sampledata",{useNewUrlParser: true,useUnifiedTopology: true});


app.set('view engine','ejs');



sample_data=[
    {name:'Deepika',age:'11',year:'2132',gender:'female'},
    {name:'Sam',age:'91',year:'2162',gender:'male'},
    {name:'Saru',age:'41',year:'2212',gender:'female'},
    {name:'Swathi',age:'6',year:'2022',gender:'female'},
    {name:'Arun',age:'10',year:'2000',gender:'male'},
    {name:'Deepu',age:'21',year:'2032',gender:'male'},
    {name:'Deepthi',age:'41',year:'2012',gender:'male'},
    {name:'Rena',age:'12',year:'2102',gender:'female'},
    {name:'xyz',age:'14',year:'2110',gender:'female'},
    {name:'Geeta',age:'20',year:'1999',gender:'female'},
]


app.get('/post',function(req,res){
    data.insertMany(sample_data,function(err,doc){
        if(err) throw err;
        console.log(doc)
        res.json(doc)
    })
})

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

app.get('/get',function(req,res){
    data.find({},function(err,dock){
        res.json(dock);
    })
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
