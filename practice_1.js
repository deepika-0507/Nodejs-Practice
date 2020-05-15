const fs = require('fs');
const http = require('http');
const event = require('events');
const eventEmitter = new event.EventEmitter();



console.log('server');


var myEventHandler = function () {
    console.log('I hear a scream!');
}

eventEmitter.on('scream', myEventHandler);

eventEmitter.emit('scream');




http.createServer(function(req,res){
    console.log('server done')
    
    fs.readFile('pra_html1.html',function(err,doc){
        res.writeHead(200, {'content-Type': 'text/html'});
        res.write(doc)
        res.end()
    })


    fs.appendFile('pra_html1.html','content added',function(err,doc){
        if(err){
            console.log(err);
        }
        console.log('appended')
        
    })


    fs.writeFile('pra_html1.html','content written',function(err,doc){
        if(err){
            console.log(err);
        }
        console.log('added')
        
    })



    fs.rename('pra_html1.html','renamed.html',function(err,doc){
        if(err){
            console.log(err);
        }
        console.log('renamed')
        
    })


    fs.unlink('pra_html1.html',function(err,doc){
        if(err){
            console.log(err);
        }
        console.log('deleted')
        
    })


}).listen(2000);
