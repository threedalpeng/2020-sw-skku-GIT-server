const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const models = require('./models/index');

let app = express();
let {
  io
} = require('./scripts/socket');
app.io = io;

models.sequelize.sync({
  alter: true
}).then(() => {
  console.log("DB connected");
}).catch(err => {
  console.log("DB failed");
  console.log(err);
});

let realtimeRouter = require('./routes/realtime/index');
let statsRouter = require('./routes/stats/index');
let settingsRouter = require('./routes/settings/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/realtime', realtimeRouter);
app.use('/api/stats', statsRouter);
app.use('/api/settings', settingsRouter);

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