#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const app = express()
const port = 11257


app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

app.use(express.static(`${__dirname}/dist`))
const bodyParser = require('body-parser')

// setup `body-parser`
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

var loandata;
var records;
fs.readFile('loandatas.json', (err, data) => {
    if (err) throw err;
    loandata = JSON.parse(data);
    console.log(loandata);
    records = loandata
    // records = loandata["user1"]; //user1


});

app.post('/readCase', function (req, res) {
    // res.send(loandata);
    // userID = req.body["user"]
    res.send(records)
});


app.post('/readJSON', function (req, res) {
    // res.send(loandata);
    userID = req.body["user"]
    res.send(records[userID])
});


app.post('/saveJSON', function (req, res) {
    // if (loandata.hasOwnProperty(req.body['ID'])) {
    //     res.send("existed")
    // } else
    var datakeys = Object.keys(req.body);
    var state = "done";
    userID = req.body["user"]
    console.log(userID)
    for (i = 0; i < datakeys.length; i++) {
        // if (check(loandata[datakeys[i]]) || check(req.body[datakeys[i]])) {
        //     console.log("!!!!!")
        //     state = "hack";
        //     break;
        // } 
        // else {

        if (datakeys[i] != "user") {
            loandata[userID]['content'][datakeys[i]] = req.body[datakeys[i]];
        }
        // }
    }
    if (state == "done") {
        let data = JSON.stringify(loandata);
        fs.writeFileSync('loandatas.json', data);
    }
    console.log(state);
    res.send(state);

});



app.post('/saveTagJSON', function (req, res) {
    // if (loandata.hasOwnProperty(req.body['ID'])) {
    //     res.send("existed")
    // } else
    // var datakeys = Object.keys(req.body);
    console.log("req:", req.body)
    console.log("SaveTag")
    userID = req.body["user"];
    var state = "done";
    tag = req.body["tag"];
    loandata[userID]['availableTags'].push(tag);

    if (state == "done") {
        let data = JSON.stringify(loandata);
        fs.writeFileSync('loandatas.json', data);
        res.send('done');
    }
});

app.post('/saveStarJSON', function (req, res) {
    // if (loandata.hasOwnProperty(req.body['ID'])) {
    //     res.send("existed")
    // } else
    // var datakeys = Object.keys(req.body);
    // console.log("req:", req.body)
    // console.log("SaveTag")
    console.log(req.body)
    var state = "done";
    var mark = req.body["starMark"];
    console.log(mark);
    var userID = req.body["user"]

    loandata[userID]['case']['star'] = mark

    if (state == "done") {
        let data = JSON.stringify(loandata);
        fs.writeFileSync('loandatas.json', data);
        res.send('done');
    }
});

app.post('/delJSON', function (req, res) {
    tag = req.body["tag"]
    var index = loandata[userID]['availableTags'].indexOf(tag)
    // delete loandata[userID][index];
    loandata[userID]['availableTags'].splice(index, 1);
    let data = JSON.stringify(loandata);
    fs.writeFileSync('loandatas.json', data);
    res.send('done');
});

function check(value) {
    char = ";\"\'()<>-+=-?!^&@$%#/\\[]"
    value_arr = String(value).split("")

    for (i = 0; i < value_arr.length; i++) {
        if (char.indexOf(value_arr[i]) >= 0) {
            return true
        }
    }
    return false
}



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