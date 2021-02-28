const models = require('../../models');

function ttod(time) {
  return new Promise((resolve) => {
    resolve(time.substr(0, 10));
  });
}

async function createDailyDataFromHoulryData() {
  const max_date = await models.daily_data.max('analyzed_time')
  const hourly_data = await models.hourly_data.findAll({
    raw: true,
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

  let cam_id = hourly_data[0].camera_id,
    cur_date = ttod(hourly_data[0].analyzed_time),
    avg_people = 0,
    max_people = 0,
    count = 0,
    avg_risk = 0,
    max_risk = 0,
    avg_congestion = 0,
    max_congestion = 0,
    cnt_alert = 0;

  for (let i = 0; i < hourly_data.length; i++) {
    if (cam_id !== hourly_data[i].camera_id || cur_date < ttod(hourly_data[i].analyzed_time)) {
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


      await models.daily_data.findOrCreate({
        where: {
          camera_id: cam_id,
          analyzed_time: cur_date,
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

      cam_id = hourly_data[i].camera_id;
      cur_hour = ttod(hourly_data[i].analyzed_time)
      avg_risk = 0;
      max_risk = 0;
      avg_congestion = 0;
      max_congestion = 0;
      avg_people = 0;
      max_people = 0;
      cnt_alert = 0;
      count = 0;
    }

    avg_risk += hourly_data[i].data_count * hourly_data[i].avg_risk;
    if (max_risk < hourly_data[i].max_risk) {
      max_risk = hourly_data[i].max_risk;
    }

    avg_congestion += hourly_data[i].data_count * hourly_data[i].avg_congestion;
    if (max_congestion < hourly_data[i].max_congestion) {
      max_congestion = hourly_data[i].max_congestion;
    }

    avg_people += hourly_data[i].data_count * hourly_data[i].avg_people;
    if (max_people < hourly_data[i].max_people) {
      max_people = hourly_data[i].max_people;
    }

    cnt_alert += hourly_data[i].alarm_count
    count += hourly_data[i].data_count;
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

  await models.daily_data.findOrCreate({
    where: {
      camera_id: cam_id,
      analyzed_time: cur_date,
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

  /* delete all hourly data
  await models.hourly_data.delete({
      truncate: true
  });
  */
}

createDailyDataFromHoulryData();