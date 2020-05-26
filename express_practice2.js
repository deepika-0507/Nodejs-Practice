const fs = require('fs')
const express = require('express')
const app = express()


app.get('/', function (req, res, next) {
    fs.readFile('file.txt', function (err, data) {
      if (err) {
        next(err) 
      } else {
        res.send(data)
      }
    })
  })



  app.get('/write', [
    function (req, res, next) {
      fs.writeFile('/path', 'file', next)
    },
    function (req, res) {
      res.send('OK')
    }
  ])



  app.get('/time', function (req, res, next) {
    setTimeout(function () {
      try {
        throw new Error('BROKEN')
      } catch (err) {
        next(err)
      }
    }, 100)
  })



  app.listen('3000', ()=>{
    console.log('starting');
    
})