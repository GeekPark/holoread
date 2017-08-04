import {request, v1, mock} from '../tools'
import Base from './base'

const {_get, _delete, _post} = new Base({})
let user = {}

describe('ADMIN: LOG', () => {
  it('create log', () => {
    return _post('logs', mock.generate.log(), 200)
  })

  it('access to all logs', () => {
    return _get('logs', {start: 0}, 200)
  })

  it('show log', async () => {
    const log = await mock.create('log')
    return _get(`logs/${log._id}`, {}, 200)
  })

  it('delete log', async () => {
    const log = await mock.create('log')
    return _delete(`logs/${log._id}`, {}, 200)
  })
})
