const passport = require('passport');

// 로컬 유저 로그인
function loginLocal(req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('login failed!');
      return res.status(401).end();
    }
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      console.log('login success!');
      return res.status(200).end();
    });
  })(req, res, next);
}

// 로컬 유저 등록
function registerLocal(req, res, next) {
  console.log('try register...');
  passport.authenticate('local-register', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.status(200).end();
    } else {
      return res.status(401).end();
    }
  })(req, res, next);
}

// 로컬 로그아웃
function logout(req, res) {
  req.logout();
  res.end();
}

module.exports = {
  loginLocal,
  registerLocal,
  logout
};