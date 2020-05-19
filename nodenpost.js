const express = require('express')
const app = express()


app.get('/get',function(req,res){
    res.json({
        message:'postman working',
    })
    console.log('postman')
})


app.post('/post',function(req,res){
    res.send('random')
})

app.listen(3000, () =>{
    console.log('running')
})