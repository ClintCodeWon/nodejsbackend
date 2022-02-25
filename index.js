const express = require('express');
const app = express();
const events = require('events');
const page = require('./page');
const fs = require('fs');
const bodyParser = require('body-parser');

//setting up middleware body parser 
app.use(bodyParser.urlencoded({extended: true}));

//Event Emitter stuff
const eventEmitter = new events.EventEmitter();
const logRequest = () => {
   console.log('log request here');
}
eventEmitter.on('logRequest', logRequest);

//get 
app.get('/entry', (req, res) => {
   let data = '';
   

   //using a callback function to read a file... see I know callbacks
   // fs.readFile('input.txt', function (err, data) {
   //    if (err) {
   //       console.log(err.stack);
   //       return;
   //    }
   //    console.log(data.toString());
   // });

   //using a stream to read the data
   const readStream = fs.createReadStream('input.txt');
   readStream.setEncoding('UTF8');
   readStream.on('data', (chunk) => {
      data += chunk;
   });

   readStream.on('end', () => {
      console.log('done reading     ' + data);
      const myReturnObj = {
         title: 'Shrek Script',
         body: data
      }
   
      res.json(myReturnObj);
   });

   readStream.on('error', () => {
      console.log('something broke in the read stream.');
      res.sendStatus(400);
   });

})

//post
app.post('/entry', (req, res) => {
   console.log('body is ', req.body.entry)

   const writeStream = fs.createWriteStream('input.txt');
   writeStream.write(req.body.entry, 'UTF8');
   writeStream.end();

   writeStream.on('finish', () => {
      res.sendStatus(200);
   });

   writeStream.on('error', () => {
      res.sendStatus(400);
   });

   
   
});

app.put('/entry', (req, res) => {

})




//middleware to log 
app.use('/page', function(req, res, next){
   console.log("A request for page received at " + Date.now());
   eventEmitter.emit('logRequest');
   next();
});

app.use('/page', page);

app.listen(3000);