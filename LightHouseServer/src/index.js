const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({dest: './uploads'});
const bcrypt = require('bcryptjs');

const routes = require('./api/routes/index');
const users = require('./api/routes/users');
const lighthouses = require('./api/routes/lighthouses');

const app = express();

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/', express.static('site'));

app.use('/api', routes);
app.use('/api/users', users);
app.use('/api/lighthouses', lighthouses);

//mongoose.connect('mongodb://localhost/lighthouse');
mongoose.connect('mongodb://lighthousedb:yKhgofbTCQJfZPg8j6elUDqsRQhltJ6j2uFx7vt3lExCjpJK8cKW5hBn4gnw4I7T08MLpg48L6QQ6JwfFSSytQ%3D%3D@lighthousedb.documents.azure.com:10255/?ssl=true')
const db = mongoose.connection

var port = process.env.port || 1337;
httpServer = http.createServer(app);
httpServer.listen(port);
console.log('httpServer is running...')