const express = require('express');
const path = require('path');
//Route file contains all API information
const routes = require('./routes/index');
const app = express();
const winston = require('winston');
winston.level = process.env.LOG || 'info';

//Specifies where views are located and using pug engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Specifies root path and where routes are defined
app.use('/', routes);

//Specifies where css, js files and images and other information is
app.use(express.static(path.join(__dirname, 'public')));

//Uses Port 3000 if no DEV_PORT env variable is set
let port = process.env.PORT || 3996;
winston.log('info', 'Starting server on port ' + port);
app.listen(port);
