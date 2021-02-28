const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const history = require('connect-history-api-fallback');

const models = require('./models/index');
const config = require('./config/config');
const configurePassport = require('./lib/passport/passport');
const {
  killProcessesOnInit
} = require('./lib/shell/utils');

let app = express();
let {
  io
} = require('./lib/socket/socket');
app.io = io;

/**
 * Sequelize ORM (DB 연결) 관련 코드
 */
models.sequelize.sync({
  alter: true
}).then(() => {
  console.log("DB connected");
}).catch(err => {
  console.log("DB failed");
  console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express 미들웨어
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

/** Session Store */
let RedisStore = connectRedis(session);
let redisClient = redis.createClient();
redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});
app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 1 // ms * s * m * h * d
  },
  store: new RedisStore({
    client: redisClient,
    host: 'localhost',
    port: 6379
  })
}));

/** Passport */
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

killProcessesOnInit();

/** REST API Routing */
app.use('/api/realtime', require('./routes/realtime/index'));
app.use('/api/stats', require('./routes/stats/index'));
app.use('/api/settings', require('./routes/settings/index'));
app.use('/api/auth', require('./routes/auth/index'));
app.use('/api/user', require('./routes/user/index'));
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

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