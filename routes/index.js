const express = require('express');

const app = express();

app.use('/auth',require('./auth'));
app.use('/usuarios',require('./usuarios'));
app.use('/enlaces',require('./enlaces'));
app.use('/archivos',require('./archivos'));


module.exports = app