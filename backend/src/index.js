const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { MONGO_URL } = require('../.env');

const app = express();

mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Entender requisições que tem body json
app.use(express.json());
app.use(routes);


app.listen(1008);

