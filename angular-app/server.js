/**
 * Created by semianchuk on 04.04.16.
 */
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express().use(express.static(
    path.join(__dirname, '')
))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(8080);