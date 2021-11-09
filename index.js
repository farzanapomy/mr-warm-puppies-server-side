const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjoai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

app.get('/', (req, res) => {
    res.send('Hello !! server is live');
})

app.listen(port, () => {
    console.log('server is running at port ', port);
})