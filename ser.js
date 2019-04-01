#!/usr/bin/env node


// Step 1 code goes here

const express = require('express');
const fs = require('fs');
// create an express, aka web server, instance
// 建立一個 express (也就是網頁伺服器)實體
const app = express()
const port = 11255



// app.get('/step1', (req, res) => {
//     res.send('<h2>hello world</h1>')
// })



app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

// Step 4 code goes here
// let nRequests = 0
// app.get('/step4', (req, res) => {
//     res.send(`this is request #${++nRequests}`)
// })

// Step 3 code goes here
app.use(express.static(`${__dirname}/dist`))

// Step 5.1 code goes here
// serve `/get` url

// app.get('/Step5', function(req, res) {
//     res.send(`<h1>Hello, ${req.query.fname} ${req.query.lname}</h1>`)
// })


const bodyParser = require('body-parser')

// setup `body-parser`
// 設定 `body-parser`
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//app.post('/step7', (req, res) => {
// `bady-parser` stores parsed data in `req.body`
// `bady-parser` 將解析好的資料存放在 `req.body`
//res.send(`<h1>Hello, ${req.body.fname} ${req.body.lname}</h1>`)
//})

//app.post('/add', function(req, res){
//    var obj = {};
//      console.log('body: ' + JSON.stringify(req.body));
//  res.send(req.body);
//});
var student;
fs.readFile('dist/students.json', (err, data) => {
    console.log('in read file');
    if (err) throw err;
    student = JSON.parse(data);
    console.log(student);
});


app.post('/readJSON', function(req, res) {
    res.send(student)
});


app.post('/saveJSON', function(req, res) {
    // console.log(student.hasOwnProperty(req.body['ID']));

    if (student.hasOwnProperty(req.body['ID'])) {
        res.send("existed")
    } else {
        student[req.body['ID']] = req.body['name'];
        let data = JSON.stringify(student);
        fs.writeFileSync('dist/students.json', data);
        res.send('done');
    }

});

app.post('/delJSON', function(req, res) {

    if (!student.hasOwnProperty(req.body['ID'])) {
        res.send("notExisted")
    } else {
        delete student[req.body['ID']];
        let data = JSON.stringify(student);
        fs.writeFileSync('dist/students.json', data);
        res.send('done');

    }

    // delete student[req.body['ID']];
    // let data = JSON.stringify(student);
    // fs.writeFileSync('dist/students.json', data);
});


/*
   const bodyParser = require('body-parser')
   app.use(bodyParser.urlencoded({ extended: false }))
   app.use(bodyParser.json())

// serve `/get` url
app.get('/get-data', function(req, res) {
res.send(`<h1>Hello, ${req.query.fname} ${req.query.lname}</h1>`)
})

app.post('/post-data', function(req, res) {
res.send(`<h1>Hello, ${req.body.fname} ${req.body.lname}</h1>`)
})

app.get('/t fs = require('fs');

fs.readFile('student.json', (err, data) => {  
if (err) throw err;
let student = JSON.parse(data);
console.log(student);
});jax-data', function(req, res) {
res.send(`<h1>Hello, ${req.query.fname} ${req.query.lname}</h1>`)
})

// start the server
app.listen(port, () => {
console.log(`Listening on port: ${port}`)
})
*/