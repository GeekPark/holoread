import User from './user'
import Article from './article'
import Search from './search'
import Log from './log'
import Like from './like'

setTimeout(() => { require('./websocket') }, 100)

export default {
  User,
  Article,
  Log,
  Search,
  Like
}
