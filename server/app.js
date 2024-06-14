const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const client = require('./db');
const cors = require('cors');

const employeeRouter = require('./routes/employee');
const projectRouter = require('./routes/project');
const accountRouter = require('./routes/account');
const clinetRouter = require('./routes/client');

const app = express();

// connecting to databse (module pattern)
const dbConnect = (async function () {
  try {
    await client.connect();
    console.log('Connected to the databse');
  } catch (err) {
    console.log(err);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', employeeRouter);
app.use('/', projectRouter);
app.use('/', accountRouter);
app.use('/', clinetRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
