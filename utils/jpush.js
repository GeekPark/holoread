import JPush from 'jpush-sdk';
import $     from './index';

const client = JPush.buildClient({
    appKey:       $.config.jpush.ACCESS_KEY,
    masterSecret: $.config.jpush.SECRET_KEY,
    isDebug:      $.config.isDev || true,
});

// 设置 options，本方法接收 5 个参数，sendno(int), time_to_live(int), override_msg_id(int), apns_production(boolean), big_push_duration(int)。
const init = function (content, alias) {
  return client.push().setPlatform('ios', 'android')
    // .setAudience(JPush.tag('555', '666'), JPush.alias('666,777'))
    .setAudience(JPush.ALL)
    .setNotification('Hi, JPush',
      JPush.ios(content || 'test'),
      JPush.android(content || 'test',
      null, 1))
    .setOptions(null, 60, null, false)
};

const report = function (id) {
  return new Promise(resolve => {
    client.getReportReceiveds(id, function(err, res) {
      if (err) {
        console.log(err.message); return;
      }
      resolve(res);
    })
  });
}

const push = function (content, data) {
  return new Promise(resolve => {
    init(content, data)
    .send(function(err, res) {
      if (err) {
        console.log(err.message)
      } else {
        console.log('Sendno: ' + res.sendno)
        console.log('Msg_id: ' + res.msg_id)
        resolve(res);
      }
    });
  });
}

// 推送
module.exports.push = async function (content, data) {
  try {
     return await push(content, data);
  } catch (e) {
      console.error(e.message);
  }
}

// 统计
module.exports.report = async function (id) {
  try {
     return await report(id);
  } catch (e) {
      console.error(e.message);
  }
}

module.exports.schedule = {
  // 设置定时任务。
  add: async function (name, time, content, data) {
     return new Promise (resolve => {
       init(content, data)
      .setSingleSchedule(time)
      .setSchedule(name, true, function (err, res) {
        if (err) {console.log(err.message);}
        console.log(res); resolve(res);
      })
     })
  },
  // 更新定时任务。
  update: function () {
    client.push().setSingleSchedule('2016-08-10 20:00:00')
    .updateSchedule('fb8fd1a4-5c91-11e6-a6b6-0021f653c902', null, null,
    function (err, res) {
      if (err) {console.log(err.message);}
    })
  },
  // 获取有效的 schedule 列表, 1 代表请求页页数，每页最多返回 50 个任务。
  all: function (page) {
    client.getScheduleList(page || 1, function (err, res) {
      if (err) {console.log(err.message)}
    })
  },
  // 获取指定的 schedule。
  find: function (name) {
    client.getSchedule(name, function (err, res) {
      if (err) {console.log(err.message)}
    })
  },
  // 删除指定的 schedule。
  delete: function (name) {
    client.delSchedule(name, function (err, res) {
      if (err) {console.log(err.message)}
      // console.log(res);
    })
  }
}
