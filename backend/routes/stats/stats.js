const models = require('../../models');
const config = require('../../config/config');
const moment = require('moment');
const {
  Op
} = require("sequelize");

// start_date에서 end_date까지 분 단위로 통계 데이터 리스트화
function getListsPerMinute(cam_id, start_date, end_date) {
  const days_period = moment(end_date).diff(moment(start_date), 'days') + 1;
  return new Promise(async (resolve, reject) => {
    prd_lists = {
      risks: [],
      congestions: []
    }

    let prd_data = await models.minutely_data.findAll({
      raw: true,
      attributes: ['analyzed_time', 'risk', 'congestion'],
      where: {
        camera_id: cam_id,
        analyzed_time: {
          [Op.gte]: start_date + " 00:00:00",
          [Op.lte]: end_date + " 23:59:59"
        }
      },
      order: [
        ['analyzed_time', 'ASC']
      ],
      logging: false
    });

    let cur_prc_time = moment(start_date + " 00:00:00");
    let pi = 0;
    let minutes_period = days_period * 24 * 60;
    let prd_time = '';
    if (prd_data.length != 0)
      prd_time = prd_data[pi].analyzed_time;

    for (let j = 0; j < minutes_period; j++) {
      if (prd_time == cur_prc_time.format('YYYY-MM-DD HH:mm:00')) {
        prd_lists.risks.push(prd_data[pi].risk);
        prd_lists.congestions.push(prd_data[pi].congestion);
        if (++pi < prd_data.length)
          prd_time = prd_data[pi].analyzed_time;
      } else {
        prd_lists.risks.push(0);
        prd_lists.congestions.push(0);
      }
      cur_prc_time.add(1, 'minutes');
    }

    resolve(prd_lists);
  });
}

// start_date에서 end_date까지 시간 단위로 통계 데이터 리스트화
function getListsPerHour(cam_id, start_date, end_date) {
  const days_period = moment(end_date).diff(moment(start_date), 'days') + 1;
  return new Promise(async (resolve, reject) => {
    prd_lists = {
      risks: [],
      congestions: []
    }

    let prd_data = await models.hourly_data.findAll({
      raw: true,
      attributes: ['analyzed_time', ['avg_risk', 'risk'],
        ['avg_congestion', 'congestion']
      ],
      where: {
        camera_id: cam_id,
        analyzed_time: {
          [Op.gte]: start_date + " 00:00:00",
          [Op.lte]: end_date + " 23:59:59"
        }
      },
      order: [
        ['analyzed_time', 'ASC']
      ],
      logging: false
    });

    let cur_prc_time = moment(start_date + " 00:00:00");
    let pi = 0;
    let hours_period = days_period * 24;
    let prd_time = '';
    if (prd_data.length != 0)
      prd_time = prd_data[pi].analyzed_time;

    for (let j = 0; j < hours_period; j++) {
      if (prd_time == cur_prc_time.format('YYYY-MM-DD HH:00:00')) {
        prd_lists.risks.push(prd_data[pi].risk);
        prd_lists.congestions.push(prd_data[pi].congestion);
        if (++pi < prd_data.length)
          prd_time = prd_data[pi].analyzed_time;
      } else {
        prd_lists.risks.push(0);
        prd_lists.congestions.push(0);
      }
      cur_prc_time.add(1, 'hours');
    }

    resolve(prd_lists);
  });
}

// start_date에서 end_date까지 하루 단위로 통계 데이터 리스트화
function getListsPerDay(cam_id, start_date, end_date) {
  const days_period = moment(end_date).diff(moment(start_date), 'days') + 1;
  return new Promise(async (resolve, reject) => {
    prd_lists = {
      risks: [],
      congestions: []
    }

    let prd_data = await models.daily_data.findAll({
      raw: true,
      attributes: ['analyzed_time', ['avg_risk', 'risk'],
        ['avg_congestion', 'congestion']
      ],
      where: {
        camera_id: cam_id,
        analyzed_time: {
          [Op.gte]: start_date,
          [Op.lte]: end_date
        }
      },
      order: [
        ['analyzed_time', 'ASC']
      ],
      logging: false
    });

    let cur_prc_time = moment(start_date + " 00:00:00");
    let pi = 0;
    let prd_time = '';
    if (prd_data.length != 0)
      prd_time = prd_data[pi].analyzed_time;

    for (let j = 0; j < days_period; j++) {
      if (prd_time == cur_prc_time.format('YYYY-MM-DD')) {
        prd_lists.risks.push(prd_data[pi].risk);
        prd_lists.congestions.push(prd_data[pi].congestion);
        if (++pi < prd_data.length)
          prd_time = prd_data[pi].analyzed_time;
      } else {
        prd_lists.risks.push(0);
        prd_lists.congestions.push(0);
      }
      cur_prc_time.add(1, 'days');
    }

    resolve(prd_lists);
  });
}

// 통계 생성 및 전달
async function getStatsByDate(req, res) {
  const unit = req.params.unit;
  const start_date = "" + req.params.start_date;
  const end_date = "" + req.params.end_date;
  let getLists;
  if (unit == 'minute') {
    getLists = getListsPerMinute;
  } else if (unit == 'hour') {
    getLists = getListsPerHour;
  } else if (unit == 'day') {
    getLists = getListsPerDay;
  } else {
    res.status(400).end();
  }

  const cam_list = await models.camera.findAll({
    raw: true,
    attributes: ['id', 'location', 'proper_n_people'],
    where: {
      user_id: req.user
    },
    logging: false
  });

  const now = moment();
  const date_this_week_begins = moment(now).subtract(8, 'days').format("YYYY-MM-DD");
  const date_this_week_ends = moment(now).subtract(1, 'days').format("YYYY-MM-DD");
  const date_last_week_begins = moment(now).subtract(15, 'days').format("YYYY-MM-DD");
  const date_last_week_ends = moment(now).subtract(9, 'days').format("YYYY-MM-DD");

  let result = [];
  for (let i = 0; i < cam_list.length; i++) {
    let cam_result = {
      id: cam_list[i].id,
      location: cam_list[i].location,
      current_hour: +(now.format('HH')),
      proper_n_people: cam_list[i].proper_n_people,
      today: {
        n_people: [],
        avg_people: 5,
        max_people: 10,
        safety_score: 5,
        prev_safety_score: 4
      },
      selected_period: {
        risks: [],
        max_risk: 0,
        avg_risk: 0,
        congestions: [],
        max_congestion: 0,
        avg_congestion: 0,
        alert_count: 5
      }
    };

    /*
     * create safety score stats
     */
    let safety_scores = await models.daily_data.findAll({
      raw: true,
      attributes: ['analyzed_time', 'safety_score', 'alert_count'],
      where: {
        camera_id: cam_list[i].id,
        analyzed_time: {
          [Op.gte]: date_last_week_begins,
          [Op.lte]: date_this_week_ends
        }
      },
      order: [
        ['analyzed_time', 'ASC']
      ],
      logging: false
    });

    let alert_count_last_week = 0;
    let safety_score_last_week = 0;
    let cnt_last_week = 0;
    let alert_count_this_week = 0;
    let safety_score_this_week = 0;
    let cnt_this_week = 0;
    for (let j = 0; j < safety_scores.length; j++) {
      if (date_last_week_ends >= safety_scores[j].analyzed_time) {
        alert_count_last_week += safety_scores[j].alert_count;
        safety_score_last_week += safety_scores[j].safety_score;
        cnt_last_week++;
      } else {
        alert_count_this_week += safety_scores[j].alert_count;
        safety_score_this_week += safety_scores[j].safety_score;
        cnt_this_week++;
      }
    }
    if (cnt_this_week != 0)
      safety_score_this_week /= cnt_this_week;
    if (cnt_last_week != 0)
      safety_score_last_week /= cnt_last_week;
    cam_result.today.safety_score = Math.round(safety_score_this_week * (1 - alert_count_this_week / (7 * 14 * 12)) * 10) / 10;
    cam_result.today.prev_safety_score = Math.round(safety_score_last_week * (1 - alert_count_last_week / (7 * 14 * 12)) * 10) / 10;

    /*
     * create stats for today
     */

    let today_hour_data = await models.hourly_data.findAll({
      raw: true,
      attributes: ['analyzed_time', 'avg_congestion', 'max_congestion'],
      where: {
        camera_id: cam_result.id,
        analyzed_time: {
          [Op.gte]: now.format('YYYY-MM-DD 00:00:00'),
          [Op.lt]: now.format('YYYY-MM-DD HH:00:00')
        }
      },
      logging: false
    });

    let today_cong = [];
    let today_avg_cong = 0;
    let today_max_cong = 0;
    let cur_today_time = moment(now.format('YYYY-MM-DD 00:00:00'));
    let hi = 0;
    let today_time = '';
    if (today_hour_data.length != 0)
      today_time = today_hour_data[hi].analyzed_time;

    for (let j = 0; j < 24; j++) {
      if (today_time == cur_today_time.format('YYYY-MM-DD HH:00:00')) {
        today_cong.push(today_hour_data[hi].avg_congestion);
        today_avg_cong += today_hour_data[hi].avg_congestion
        if (today_max_cong < today_hour_data[hi].max_congestion)
          today_max_cong = today_hour_data[hi].max_congestion
        if (++hi < today_hour_data.length)
          today_time = today_hour_data[hi].analyzed_time;
      } else {
        today_cong.push(0);
      }
      cur_today_time.add(1, 'hours');
    }
    if (today_hour_data.length != 0)
      today_avg_cong /= today_hour_data.length;

    cam_result.today.n_people = today_cong;
    cam_result.today.avg_people = today_avg_cong;
    cam_result.today.max_people = today_max_cong;


    /*
     * create max and avg stats for selected period
     */

    let prd_daily_data = await models.daily_data.findAll({
      raw: true,
      attributes: ['analyzed_time', 'avg_risk', 'max_risk', 'avg_congestion', 'max_congestion', 'alert_count'],
      where: {
        camera_id: cam_list[i].id,
        analyzed_time: {
          [Op.gte]: start_date,
          [Op.lte]: end_date
        }
      },
      logging: false
    });

    let prd_avg_risk = 0;
    let prd_max_risk = 0;
    let prd_avg_congestion = 0;
    let prd_max_congestion = 0;
    let prd_alert_count = 0;
    let prd_cnt = prd_daily_data.length;
    for (let j = 0; j < prd_cnt; j++) {
      prd_avg_risk += prd_daily_data[j].avg_risk;
      if (prd_max_risk < prd_daily_data[j].max_risk) {
        prd_max_risk = prd_daily_data[j].max_risk;
      }
      prd_avg_congestion += prd_daily_data[j].avg_congestion
      if (prd_max_congestion < prd_daily_data[j].max_congestion) {
        prd_max_congestion = prd_daily_data[j].max_congestion;
      }
      prd_alert_count += prd_daily_data[j].alert_count
    }
    if (prd_cnt != 0) {
      prd_avg_risk /= prd_cnt;
      prd_avg_congestion /= prd_cnt;
    }
    prd_avg_risk = Math.round(prd_avg_risk * 100) / 100;
    prd_avg_congestion = Math.round(prd_avg_congestion * 100) / 100;
    cam_result.selected_period.avg_risk = prd_avg_risk;
    cam_result.selected_period.avg_congestion = prd_avg_congestion;
    cam_result.selected_period.max_risk = prd_max_risk;
    cam_result.selected_period.max_congestion = prd_max_congestion;
    cam_result.selected_period.alert_count = prd_alert_count;

    /*
     * create list stats for selected period
     */

    let prd_lists = await getLists(cam_result.id, start_date, end_date);
    cam_result.selected_period.risks = prd_lists.risks
    cam_result.selected_period.congestions = prd_lists.congestions

    result.push(cam_result);
  }

  /*
   * hard coding for sample data (never use except testing)

  result[0].proper_n_people = 20;
  result[1].proper_n_people = 30;
  result[2].proper_n_people = 9;
  for (let i = 0; i < 3; i++) {
      let perc = (result[i].proper_n_people / 60);
      for (let j = 0; j < 24; j++) {
          result[i].today.n_people[j] = Math.round(result[i].today.n_people[j] * perc);
      }
      result[i].today.avg_people = Math.round(result[i].today.avg_people * perc);
      result[i].today.max_people = Math.round(result[i].today.max_people * perc);
  }
  */

  res.send(result);
}

module.exports = {
  getStatsByDate
};