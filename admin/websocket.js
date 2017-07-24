
import socketIO from 'socket.io'
import mongoose from 'mongoose'
import $ from '../utils'

const connc = mongoose.createConnection($.config.sessiondb);
const SessionSchema = mongoose.Schema({
  expires: String,
  session: String,
  _id:     String,
});
const SessionModel = connc.model('Session', SessionSchema);
const io = socketIO.listen($.config.ws);
const lockCache = new Map();

io.sockets.on('connect', async function (socket) {

  const cookies = socket.handshake.headers.cookie;
  const sid = getCookie(cookies, 'connect.sid');
  const session_id = decodeURIComponent(sid).match(/s\:([^.]+)/im)[1];
  const result = await SessionModel.findOne({_id: session_id});
  const user = JSON.parse(result.session).user;
  const userTpl = `${user.nickname} ${user._id}`;
  const item = {socket_id: socket.id, user_id: user._id, nickname: user.nickname};

  $.debug(`connect: ${userTpl}`)
  socket.on('lock', function (data) {
    const article = data.article;
    if (lockCache.has(article._id) &&
        lockCache.get(article._id).user_id !== user._id) {
      $.debug(`lockFailed: ${article.edited_title} ${article._id}`);
      socket.emit('lockState', {nickname: lockCache.get(article._id).nickname,                        type:     'failed'});
      return;
    };
    item.article_id = article._id;
    lockCache.set(article._id, item);
    socket.emit('lockState', {nickname: item.nickname, type: 'success'});
    $.debug(`lock: ${data.article.edited_title} ${article._id}`);
  })

  socket.on('disconnect', function (data) {
    removeItem(item.article_id, user._id)
    $.debug(`disconnect: ${userTpl}`)
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
