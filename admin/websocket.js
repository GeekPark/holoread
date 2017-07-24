

import mongoose from 'mongoose'
import $ from '../utils'
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: $.config.ws });
const connc = mongoose.createConnection($.config.sessiondb);
const SessionSchema = mongoose.Schema({
  expires: String,
  session: String,
  _id:     String,
});
const LockSchema = mongoose.Schema({
  article_id: String,
  user_id:    String,
  nickname:   String,
  title:      String,
});
const SessionModel = connc.model('Session', SessionSchema);
const LockModel = connc.model('Lock', LockSchema);


wss.on('connection', async function (socket, req) {
  const cookies = req.headers.cookie;
  const sid = getCookie(cookies, 'connect.sid');
  const session_id = decodeURIComponent(sid).match(/s\:([^.]+)/im)[1];
  const result = await SessionModel.findOne({_id: session_id});
  const user = JSON.parse(result.session).user;
  const userTpl = `${user.nickname} ${user._id}`;
  const item = {user_id: user._id, nickname: user.nickname};

  $.debug(`connect: ${userTpl}`)
  socket.on('message', async function (data) {
    const json = JSON.parse(data)
    const article = json.article;
    const exist = await LockModel.findOne({article_id: article._id});
    if (json.channel === 'lock') {
      if (exist !== undefined && exist !== null && exist.user_id !== user._id) {
        $.debug(`lockFailed: ${article.edited_title} ${article._id}`);
        socket.send(JSON.stringify({channel:  'lockState',
                      nickname: exist.nickname,
                      type:     'failed'
                    }));
        return;
      }else {
        const exist = await LockModel.create({article_id: article._id,
                                        user_id: user._id,
                                        nickname: item.nickname});
        socket.send(JSON.stringify({channel: 'lockState',
                                    nickname: item.nickname,
                                    type: 'success'}));
        $.debug(`lock: ${article.edited_title} ${article._id}`);
      }
    }
  })

  socket.on('close', async function (data) {
    const exist = await LockModel.remove({user_id: user._id});
    $.debug(`close: ${userTpl}`)
  })
})



function getCookie(cookie, objName){
  const arrStr = cookie.split("; ");
  for(let i = 0;i < arrStr.length;i ++){
    let temp = arrStr[i].split("=");
    if(temp[0] == objName) return unescape(temp[1]);
  }
}
