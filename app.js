'use strict';

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/style.css'));
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/bundle.js'));
});

module.exports = app;
