#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const app = express()
const port = 11255


app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

app.use(express.static(`${__dirname}/dist`))
const bodyParser = require('body-parser')

// setup `body-parser`
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var student;
fs.readFile('students.json', (err, data) => {
    if (err) throw err;
    student = JSON.parse(data);
    // console.log(student);
});


app.post('/readJSON', function(req, res) {
    res.send(student)
});


app.post('/saveJSON', function(req, res) {
    if (student.hasOwnProperty(req.body['ID'])) {
        res.send("existed")
    } else {
        student[req.body['ID']] = req.body['name'];
        let data = JSON.stringify(student);
        fs.writeFileSync('students.json', data);
        res.send('done');
    }

});

app.post('/delJSON', function(req, res) {

    if (!student.hasOwnProperty(req.body['ID'])) {
        res.send("notExisted")
    } else {
        delete student[req.body['ID']];
        let data = JSON.stringify(student);
        fs.writeFileSync('students.json', data);
        res.send('done');

    }

});

// app.get('/step1', (req, res) => {
//     res.send('<h2>hello world</h1>')
// })

// let nRequests = 0
// app.get('/step4', (req, res) => {
//     res.send(`this is request #${++nRequests}`)
// })

// app.get('/Step5', function(req, res) {
//     res.send(`<h1>Hello, ${req.query.fname} ${req.query.lname}</h1>`)
// })

// app.post('/step7', (req, res) => {
// res.send(`<h1>Hello, ${req.body.fname} ${req.body.lname}</h1>`)
// })