/**
 * @author eric
 * @version 1.0.0
 */

import Models from '../models'
import $      from './index'
import yaml   from 'js-yaml'
import fs     from 'fs'
import path   from 'path'


const UserModel       = Models.UserModel;
const filePath        = path.join(__dirname, 'permission.yml');
const result          = $.result;
const permissionCache = {};
let   yml             = {};
const jwt             = require('jsonwebtoken');


try {
  yml = yaml.safeLoad(fs.readFileSync(filePath , 'utf8'));
} catch (e) {
  console.error(e);
}


const verify = function  (token) {
  return new Promise ((resolve, reject) => {
    jwt.verify(token, $.config.secret, (err, value) => {
      if (err) {reject(err); return;}
      resolve(value);
    });
  });
}


export default {

  sign: (json) => {
    const token = jwt.sign(json, $.config.secret, { expiresIn: '180d'});
    return token;
  },

  verify,

  loadUser: async function (req, res, next) {
    const token  = req.headers.token || req.body.token || null;
    if ($.empty(token)) return result(res, 'load user error');
    const user = await UserModel.find({'token': token});
    $.debug(user._id);
    req.user = user;
    next();
  },

  authToken: async function (req, res, next) {
    const token = req.headers.token || req.body.token || null;
    if ($.empty(token)) { return result(res, 'token error'); }

    verify(token).then(async (decode) => {
      const user = await UserModel.find({'_id': decode.user});
      if (user) req.user = user, next();
      else result(res, 'token error');
    }).catch(e => {
      result(res, 'token error');
    })
  },


  authSession: async function (req, res, next) {

    if ($.empty(req.session.user)) return result(res, 'session error');

    if (req.session.user.permission.indexOf('admin') <= 0) {
      return result(res, 'permission denied');
    }
    $.debug(`auth session: ${req.session.user.phone}`)
    next();
  }
}
