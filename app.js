var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(80, function () {
    console.log("server is running..");
});