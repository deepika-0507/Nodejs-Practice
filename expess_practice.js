const express = require('express')
const app = express()
const new_paths = require('./routers')


const port = 3000

app.use('/birds',new_paths)

app.set('view engine','ejs');

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


app.get('/ab*cd',function(req,res){
    console.log(req);
    res.send('ab*cd');
})



app.get('/e/a',function(req,res,next){
    console.log('examples for next')
    next()
  },
  function(req,res){
      res.send('Examples for next a')
    
})



var cb0 = function (req, res, next) {
    console.log('CB0')
    next()
  }
  
  var cb1 = function (req, res, next) {
    console.log('CB1')
    next()
  }
  
  app.get('/example/d', [cb0, cb1], function (req, res, next) {
    console.log('response from the function')
    next()
  }, function (req, res) {
    res.send('response from the function D')
  })



app.get('/json',function(req,res){
    res.json('json text')
})



app.get('/first/:id',function(req,res){
    var x = req.params.id
    console.log(x);
    res.render('trail.ejs',{x:x});
})

