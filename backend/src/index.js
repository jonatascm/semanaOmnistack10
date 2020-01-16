const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const connectionString = require('./mongooseConectionString');

const app = express();

mongoose.connect(connectionString(),{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Entender requisições que tem body json
app.use(express.json());
app.use(routes);


app.listen(1008);

