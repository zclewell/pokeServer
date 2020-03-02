const express = require('express');
const { MongoClient } = require('mongodb');
const secrets = require('./secrets');

const app = express();

const uri = `mongodb+srv://${secrets.username}:${secrets.password}@${secrets.server}/test?retryWrites=true&w=majority`;
const client = MongoClient(uri);

function getRoot(req, res) {
  res.end('Hello World!');
}

async function getNumber(req, res) {
  const raw = parseInt(req.params.id, 10);

  let formatted = raw.toString();
  if (raw < 10) {
    formatted = `00${formatted}`;
  } else if (raw < 100) {
    formatted = `0${formatted}`;
  }

  const query = { number: formatted };
  const result = await client.db('monDb').collection('monCollection').findOne(query);

  res.end(JSON.stringify(result));
}

async function getSearch(req, res) {
  const { term } = req.params;

  let query = { name: term };
  let result = await client.db('monDb').collection('monCollection').find(query).toArray();
  query = { number: term };
  result = result.concat(await client.db('monDb').collection('monCollection').find(query).toArray());

  res.end(JSON.stringify(result));
}

app.get('/', getRoot);
app.get('/number/:id', getNumber);
app.get('/search/:term', getSearch);

async function serverFunc() {
  await client.connect();
}
app.listen(8081, serverFunc);
