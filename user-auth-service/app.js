var createError = require('http-errors');
var express = require('express');
const bodyParser = require("body-parser");
var logger = require('morgan');
var database = require('./utils/database')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var authRouter = require('./routes/auth')

var app = express();
initDb();

app.use(logger('dev'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;

/**
 * Initializes database.
 * @param param
 */
async function initDb() {
  console.log("Initialize database.")
  await database.dbConnection.query(database.createUserTableQuery)
  await database.dbConnection.query(database.createTokenTableQuery)
}