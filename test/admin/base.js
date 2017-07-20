/**
 * @author
 * @version 1.0.0
 */
import {request, admin, mock} from '../tools';


export default class Base {
  constructor(options) {
    addMethods(this);
    Object.keys(options).forEach(el => this[el] = options[el]);
  }
}


const addMethods = (_this) => {
  _this._get = (url, reqData, statusCode) => {
    return new Promise( (resolve, reject) => {
      request
      .get(`${admin}${url}`)
      .query(reqData)
      .then((res) => {
        res.statusCode.should.equal(statusCode)
        resolve();
      })
      .catch(e => reject(e))
    })
  }

  ['post', 'put', 'delete'].forEach(el => {
    _this[`_${el}`] = (url, reqData, statusCode) => {
      return new Promise( (resolve, reject) => {
        request[el](`${admin}${url}`)
        .send(reqData)
        .then((res) => {
          res.statusCode.should.equal(statusCode)
          resolve();
        })
        .catch(e => reject(e))
      })
    }
  })
}
