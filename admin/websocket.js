

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
const SessionModel = connc.model('Session', SessionSchema);
const lockCache = new Map();

wss.on('connection', async function (socket, req) {
  const cookies = req.headers.cookie;
  const sid = getCookie(cookies, 'connect.sid');
  const session_id = decodeURIComponent(sid).match(/s\:([^.]+)/im)[1];
  const result = await SessionModel.findOne({_id: session_id});
  const user = JSON.parse(result.session).user;
  const userTpl = `${user.nickname} ${user._id}`;
  const item = {socket_id: socket.id, user_id: user._id, nickname: user.nickname};

  $.debug(`connect: ${userTpl}`)
  socket.on('message', function (data) {
    const json = JSON.parse(data)
    const article = json.article;
    if (json.channel === 'lock') {
      if (lockCache.has(article._id) &&
        lockCache.get(article._id).user_id !== user._id) {
        $.debug(`lockFailed: ${article.edited_title} ${article._id}`);
        socket.send(JSON.stringify({channel:  'lockState',
                      nickname: lockCache.get(article._id).nickname,
                      type:     'failed'
                    }));
        return;
      };
       item.article_id = article._id;
      lockCache.set(article._id, item);
      socket.send(JSON.stringify({channel: 'lockState',
                                  nickname: item.nickname,
                                  type: 'success'}));
      $.debug(`lock: ${article.edited_title} ${article._id}`);
    }
    //


  })

  socket.on('close', function (data) {
    removeItem(item.article_id, user._id)
    $.debug(`close: ${userTpl}`)
  })
})

function removeItem (article_id, user_id) {
  for (let [key, value] of lockCache) {
    if (key === article_id && value.user_id === user_id) {
      lockCache.delete(article_id);
      return;
    }
  }
}


function getCookie(cookie, objName){
  const arrStr = cookie.split("; ");
  for(let i = 0;i < arrStr.length;i ++){
    let temp = arrStr[i].split("=");
    if(temp[0] == objName) return unescape(temp[1]);
  }
}
