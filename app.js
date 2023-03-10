const {render} = require('ejs')
const express = require('express');
const fs = require('fs');
const mongodb = require('mongodb');
const path = require('path');
const routes = require('./route/route');
const db = require('./data/database');


const app = express();
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.connectToDatabase().then(function(){
    app.listen(3000);

})
