 import config  from './config';
 import crypto  from 'crypto';
 import moment  from 'moment';
 import log4js  from 'log4js';
 import joi     from 'joi';
 import request from 'request'

log4js.configure(config.log, {});
const logger = log4js.getLogger('debug');
logger.setLevel('auto');

module.exports           = logger;
module.exports.paramter  = joi;
module.exports.moment    = moment;
module.exports.config    = config;
module.exports.logAccess = log4js.connectLogger(log4js.getLogger('access'), {
  level: 'auto'
});

module.exports.md5 = function (str) {
  return crypto.createHash('md5').update(str.toString()).digest('hex');
};

module.exports.base64 = function (str) {
  return Buffer(str.toString()).toString('base64');
};

module.exports.trimStr = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports.createCode = () => {
  return Math.random().toString(10).substring(14);
}

module.exports.createSms = async (mobile, code) => {
  const tpl = `【极客公园】您的验证码是 ${code}， 有效期为30分钟。请妥善保管您的验证码，勿透露给他人`
  try {
    return request({
      url: "https://sms.yunpian.com/v2/sms/single_send.json",
      method: "POST",
      headers: {
        "Accept":"application/json; charset=utf-8",
        "Content-Type":"application/x-www-form-urlencoded;charset=utf-8"
      },
      body: `mobile=${mobile}&text=${tpl}&apikey=${config.yunpian}`
    }, function (error, response, body) {
      console.log('error:', error);
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
        })
  } catch (e) {
    $.debug(e);
    return -1;
  }
};

/**
 * 生成 API 返回数据
 * @param   res     response
 * @param   data    返回数据 （code===0:数据体, code>0:error message)
 * @param   code    Error Code (default: 0)
 * @param   status  Status Code (default: 200)
 */
module.exports.result = function (res, data, status) {
  let redata = {};
  if (typeof data === 'string' ||
    data === 'null' ||
    data === undefined ||
    data === null) {
    status = status || 400;
    redata = {
      msg: data,
      data: {}
    };
  } else {
    status = status || 200;
    redata = {
      msg: '',
      data: data
    };
  }
  res.status(status).send(redata);
};

module.exports.true = function (value) {
  if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string') {
    return '1 true yes ok'.split(' ').indexOf(value.trim().toLowerCase()) !== -1;
  } else {
    return !!value;
  }
};

module.exports.empty = function (value) {
  if (typeof value == 'string') {
    return value.trim() === '';
  } else if (typeof value == 'number') {
    return value === 0;
  } else {
    return value === null ||
           value === undefined;
  }
};

module.exports.dateformat = function (obj, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss';
  if (process.env.NODE_ENV === 'test') {
    return obj;
  }
  return moment(obj).format(format);
}

module.exports.DateAdd = function (interval, number, date) {
  switch (interval) {
  case "y": {
    date.setFullYear(date.getFullYear() + number);
    return date;
    break;
  }
  case "q": {
    date.setMonth(date.getMonth() + number * 3);
    return date;
    break;
  }
  case "m": {
    date.setMonth(date.getMonth() + number);
    return date;
    break;
  }
  case "w": {
    date.setDate(date.getDate() + number * 7);
    return date;
    break;
  }
  case "d": {
    date.setDate(date.getDate() + number);
    return date;
    break;
  }
  case "h": {
    date.setHours(date.getHours() + number);
    return date;
    break;
  }
  case "m": {
    date.setMinutes(date.getMinutes() + number);
    return date;
    break;
  }
  case "s": {
    date.setSeconds(date.getSeconds() + number);
    return date;
    break;
  }
  default: {
    date.setDate(d.getDate() + number);
    return date;
    break;
  }
  }
}
