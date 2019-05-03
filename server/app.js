const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
var jsonFile = JSON.parse(fs.readFileSync('server/data.json'));

app.use(bodyParser.json());
app.use(morgan(':method :url :status'));

app.get('/', function(req, res){
    res.send(["OK"]).status(200);
});

app.get('/api/TodoItems', (req, res) => {
    res.send(jsonFile).status(200);
});

app.get('/api/TodoItems/*', (req, res) => {
    res.send(jsonFile[req.params[0]]).status(200);
});

app.post('/api/TodoItems', (req, res) => {
    res.status(201);
    jsonFile[req.body["todoItemId"]] = req.body;
    fs.writeFile("server/data.json", JSON.stringify(jsonFile, null, 2), 'utf8', function (err) {
        if (err) throw err;
        console.log(`writing: ${JSON.stringify(req.body, null, 2)}`);
    });
    res.send(jsonFile[req.body["todoItemId"]]);
});

app.delete('/api/TodoItems/*', (req, res) => {
    res.send(jsonFile[req.params[0]]).status(200);
    console.log(`deleting: ${JSON.stringify(jsonFile[req.params[0]])}`);
    var array = [];
    for(let i = 0; i < jsonFile.length; i++){
        array.push(jsonFile[i]);
    }
    array.splice(req.params[0], 1);
    jsonFile = array;
    for(let i = 0; i < jsonFile.length; i++){
        array[i]["todoItemId"] = i;
    }
    fs.writeFileSync("server/data.json", JSON.stringify(jsonFile, null, 2));
});

module.exports = app;
