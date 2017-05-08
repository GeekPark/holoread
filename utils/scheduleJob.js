const schedule = require('node-schedule');

module.exports.add = function (date, cb) {
  const j = schedule.scheduleJob(date, function () {
    cb();
  });
  return j;
}
