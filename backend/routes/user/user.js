const models = require('../../models');
const config = require('../../config/config');
const moment = require('moment');
const {
  Op
} = require("sequelize");

function getListOfCamera(req, res) {
  if (req.isAuthenticated())
    return res.send(
      models.camera.findAll({
        where: {
          user_id: req.user
        },
        raw: true,
        logging: false,
        attributes: ['id', 'location']
      }));
  else
    return res.status(401).end();
}

module.exports = {
  getListOfCamera
}