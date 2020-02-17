const express = require('express');
const { MongoClient } = require('mongodb');
const secrets = require('./secrets');

var app = express();

const uri = 'mongodb+srv://' + secrets.username + ':' + secrets.password + '@' + secrets.server + '/test?retryWrites=true&w=majority';
const client = MongoClient(uri);


app.get('/', function(req, res) {
    res.end('Hello World!');
});

app.get('/number/:id', async function(req, res) {
    var result = await client.db('monDb').collection('monCollection').findOne({number: req.params.id});
    
    res.end(JSON.stringify(result));
});

app.get('/name/:id', async function(req, res) {
    var result = await client.db('monDb').collection('monCollection').findOne({name: req.params.id});

    res.end(JSON.stringify(result));
})

var server = app.listen(8081, async function () {
    await client.connect();
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});