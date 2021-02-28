const {
  PythonShell
} = require('python-shell');
const schedule = require('node-schedule');
const models = require('../models');
const moment = require('moment');
const config = require('../config/config');
const {
  Op
} = require('sequelize');


class Camera {
  constructor(camera_id, io) {
    this.camera_id = camera_id;
    console.log(this.camera_id + " Created");
    /** Get camera_info */
    /*
    this._camera_info = models.camera.findByPk(this.camera_id, {
        raw: true
    });
    */
    this._schd_realtime = schedule.scheduleJob('0 * * * * *', this.uploadRealtimeData.bind(this));
    this._schd_check_alert = schedule.scheduleJob('0 */5 * * * *', this.checkAlert.bind(this));
    this._n_people = 0;
    this._risk = 0;
    this._congestion = 0;
    this._cnt_stream = 0;
    this.room = 'cam ' + this.camera_id;
    this._camera_info;
    this._process = null;
    this._schd_realtime;
    this._schd_check_alert;
    this.io = io;
  }

  async uploadRealtimeData() {
    let n_people = this._n_people;
    let risk = this._risk;
    let congestion = this._congestion;
    let cnt_stream = this._cnt_stream;

    this._n_people = 0;
    this._risk = 0;
    this._congestion = 0;
    this._cnt_stream = 0;

    if (cnt_stream != 0) {
      n_people /= cnt_stream;
      risk /= cnt_stream;
      congestion /= cnt_stream;
      // console.log(n_people + ' ' + risk + ' ' + congestion + ' ' + cnt_stream);

      let now = moment().subtract(1, 'minutes');

      await models.minutely_data.create({
        camera_id: this.camera_id,
        analyzed_time: now.format("YYYY-MM-DD HH:mm:00"),
        n_people: n_people,
        risk: risk,
        congestion: congestion
      }, {
        logging: false
      });
    }
  }

  async checkAlert() {
    let end_time = moment().subtract(1, 'minutes');
    let beg_time = moment(end_time).subtract(4, 'minutes');
    let alert_crit = await models.camera.findByPk(this.camera_id, {
      attributes: ['alarm_criteria', 'alarm_by_email']
    });
    if (alert_crit.alarm_by_email) {
      let data_last_five_minutes = await models.minutely_data.findAll({
        raw: true,
        where: {
          camera_id: this.camera_id,
          analyzed_time: {
            [Op.gte]: beg_time.format("YYYY-MM-DD HH:mm:00"),
            [Op.lte]: end_time.format("YYYY-MM-DD HH:mm:00")
          }
        },
        attributes: ['risk', 'congestion'],
        logging: false
      });

      let total_risk = 0;
      let total_congestion = 0;
      let cnt_data = data_last_five_minutes.length;
      for (let i = 0; i < cnt_data; i++) {
        total_risk += data_last_five_minutes[i].risk;
        total_congestion += data_last_five_minutes[i].congestion;
      }
      if (cnt_data != 0) {
        total_risk /= cnt_data;
        total_congestion /= cnt_data;
      }

      let alert_result = 0;

      if (total_risk >= alert_crit.alarm_criteria) {
        alert_result = 1;
      } else if (total_congestion >= alert_crit.alarm_criteria) {
        alert_result = 2;
      }

      if (alert_result > 0) {
        await models.minutely_data.findOrCreate({
          where: {
            camera_id: this.camera_id,
            analyzed_time: beg_time.format("YYYY-MM-DD HH:mm:00")
          },
          defaults: {
            camera_id: this.camera_id,
            analyzed_time: beg_time.format("YYYY-MM-DD HH:mm:00"),
            risk: 0,
            congestion: 0,
            n_people: 0
          },
          logging: false
        });
        await models.minutely_data.update({
          alert_checked: true
        }, {
          where: {
            camera_id: this.camera_id,
            analyzed_time: beg_time.format("YYYY-MM-DD HH:mm:00")
          },
          logging: false
        });

        // DO ALERT!!
        this.alertRisk(alert_result);
      }
    }
  }

  countRealtimeData(stream) {
    this._n_people += stream.total_people;
    this._risk += stream.risk;
    this._congestion += stream.congestion;
    this._cnt_stream++;
  }

  alertRisk(alert_code) {
    /* Alert Data When Risk has ARISED */
    console.log(`${alert_code} to ${this.room}`);
    this.io.to(this.room).emit('alert', alert_code);
  }

  async runProcess() {
    console.log("Run camera " + this.camera_id);
    // let option = Camera.createPythonOption(this.camera_id);
    // console.log(option);
    const camera_info = await models.camera.findByPk(this.camera_id, {
      raw: true,
      attributes: ['mode', 'access_path', 'room_size', 'distance_criteria', 'proper_n_people', 'blurring']
    })
    let mode;
    if (camera_info.mode == 'live')
      mode = '-l';
    else if (camera_info.mode == 'video')
      mode = '-v';

    let option = {
      scriptPath: config.path.python,
      args: ["-a", camera_info.access_path, mode, "-i", this.camera_id, "-S", camera_info.room_size, "-D", camera_info.distance_criteria, "-P", camera_info.proper_n_people]
    }
    if (camera_info.blurring) {
      option.args.push("-b");
    }

    await this.killProcess();
    this._process = PythonShell.run('PreVentra_main.py', option, () => {
      console.log("cam_id: " + this.camera_id + " End!");
    });
  }

  static async createPythonOption(camera_id) {
    const camera_info = await models.camera.findByPk(camera_id, {
      raw: true,
      where: {
        id: camera_id
      },
      attributes: ['mode', 'access_path', 'room_size', 'distance_criteria', 'proper_n_people', 'blurring']
    })
    let mode;
    if (camera_info.mode == 'live')
      mode = '-l';
    else if (camera_info.mode == 'video')
      mode = '-v';


    let option = {
      scriptPath: config.path.python,
      args: ["-a", camera_info.access_path, mode, "-i", camera_info.id, "-S", camera_info.room_size, "-D", camera_info.distance_criteria, "-P", camera_info.proper_n_people]
    }
    if (camera_info.blurring) {
      option.args.push("-b");
    }
    console.log(option);
    return option;
  }

  killProcess(signal = "SIGINT") {
    return new Promise((resolve, reject) => {
      if (this._process !== null) {
        this._process.kill(signal);
      }
      resolve();
    });
  }
}

module.exports = Camera;