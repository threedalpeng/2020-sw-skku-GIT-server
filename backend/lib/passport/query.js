/**
 **  For Test 
 */
const {
  generateSalt,
  encryptPassword
} = require('./utils');
const models = require('../../models');

async function putNewPassword(user_id, password) {
  let salt = await generateSalt();
  console.log(salt);
  let key = await encryptPassword(password, salt);
  console.log(key);
  await models.user.update({
    password: key,
    salt: salt
  }, {
    where: {
      id: user_id
    }
  });
  let updated_user = await models.user.findByPk(user_id);
}

putNewPassword(1, "snowshoe");