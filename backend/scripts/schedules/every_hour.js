const models = require('../../models');
const moment = require('moment');
const {
  Op
} = require('sequelize');

function ttoh(time) {
  return new Promise((resolve) => {
    resolve(time.substr(0, 13) + ":00:00");
  });
}

async function createHourlyDataFromMinutelyData() {
  const max_date = await models.hourly_data.max('analyzed_time')
  const minutely_data = await models.minutely_data.findAll({
    raw: true,
    attributes: ['camera_id', 'analyzed_time', 'n_people', 'risk', 'congestion', 'alert_checked'],
    order: [
      ['camera_id', 'ASC'],
      ['analyzed_time', 'ASC']
    ],
    where: {
      analyzed_time: {
        [Op.gt]: max_date
      }
    }
  });

  let cam_id = minutely_data[0].camera_id,
    cur_hour = ttoh(minutely_data[0].analyzed_time),
    avg_people = 0,
    max_people = 0,
    count = 0,
    avg_risk = 0,
    max_risk = 0,
    avg_congestion = 0,
    max_congestion = 0,
    cnt_alert = 0;

  for (let i = 0; i < minutely_data.length; i++) {
    if (cam_id !== minutely_data[i].camera_id || cur_hour < ttoh(minutely_data[i].analyzed_time)) {
      // Save compressed data into hourly_data table
      if (count == 0) {
        avg_risk = 0;
        max_risk = 0;
        avg_congestion = 0;
        max_congestion = 0;
        avg_people = 0;
        cnt_alert = 0;
      } else {
        avg_risk /= count;
        avg_congestion /= count;
        avg_people /= count;
      }

      //data += (cam_id + ", " + cap_date + ", " + cap_time + ", " + risk + ", " + congestion + ", " + avg_people + ", " + max_people + '\n');

      await models.hourly_data.findOrCreate({
        where: {
          camera_id: cam_id,
          analyzed_time: cur_hour,
        },
        defaults: {
          avg_risk: avg_risk,
          max_risk: max_risk,
          avg_congestion: avg_congestion,
          max_congestion: max_congestion,
          avg_people: avg_people,
          max_people: max_people,
          alarm_count: cnt_alert,
          data_count: count
        }
      });

      cam_id = minutely_data[i].camera_id;
      cur_hour = ttoh(minutely_data[i].analyzed_time)
      avg_risk = 0;
      max_risk = 0;
      avg_congestion = 0;
      max_congestion = 0;
      avg_people = 0;
      max_people = 0;
      cnt_alert = 0;
      count = 0;
    }

    avg_risk += minutely_data[i].risk;
    if (max_risk < minutely_data[i].risk) {
      max_risk = minutely_data[i].risk;
    }

    avg_congestion += minutely_data[i].congestion;
    if (max_congestion < minutely_data[i].congestion) {
      max_congestion = minutely_data[i].congestion;
    }

    avg_people += minutely_data[i].n_people;
    if (max_people < minutely_data[i].n_people) {
      max_people = minutely_data[i].n_people;
    }

    if (minutely_data[i].alert_checked) {
      cnt_alert += 1;
    }
    count += 1;
  }

  if (count == 0) {
    avg_risk = 0;
    max_risk = 0;
    avg_congestion = 0;
    max_congestion = 0;
    avg_people = 0;
    cnt_alert = 0;
  } else {
    avg_risk /= count;
    avg_congestion /= count;
    avg_people /= count;
  }

  //data += (cam_id + ", " + cap_date + ", " + cap_time + ", " + risk + ", " + congestion + ", " + avg_people + ", " + max_people + '\n');
  //console.log([cam_id, cap_date, cap_time, risk, congestion, avg_people, max_people]);

  await models.hourly_data.findOrCreate({
    where: {
      camera_id: cam_id,
      analyzed_time: cur_hour,
    },
    defaults: {
      avg_risk: avg_risk,
      max_risk: max_risk,
      avg_congestion: avg_congestion,
      max_congestion: max_congestion,
      avg_people: avg_people,
      max_people: max_people,
      alarm_count: cnt_alert,
      data_count: count
    }
  });

  //fs.writeFileSync("test.txt", data, "utf8");

  /* delete all minutely data
  await models.minutely_data.destroy({
    truncate: true
  });
  */
}

createHourlyDataFromMinutelyData();