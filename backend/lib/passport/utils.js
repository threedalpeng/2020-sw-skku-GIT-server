const crypto = require('crypto');

// 64비트 솔트 생성
function generateSalt() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, function (err, buffer) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(buffer.toString('base64'));
      }
    });
  });
}

// 패스워드 단방향 암호화
function encryptPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 250000, 64, 'sha512', function (err, key) {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString('base64'));
      }
    })
  });
}

// 입력한 패스워드 검증
async function validatePassword(user, pw_entered) {
  let key = await encryptPassword(pw_entered, user.salt);
  return (key === user.password);
}

module.exports = {
  validatePassword,
  generateSalt,
  encryptPassword
}