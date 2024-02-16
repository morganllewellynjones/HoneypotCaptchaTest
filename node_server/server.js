const express = require('express');
const path = require('path');

const server = express();
const port = 8080;

server.get('/', (req, res) => { res.sendFile(path.join(__dirname, '/index.html')) } );

server.listen(port, (req, res) => {});
