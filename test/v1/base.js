/**
 * @author
 * @version 1.0.0
 */
import {request, v1, mock} from '../tools';


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
      .get(`${v1}${url}`)
      .query(reqData)
      .then((res) => {
        console.log(res.body.msg);
        res.statusCode.should.equal(statusCode)
        resolve();
      })
      .catch(e => reject(e))
    })
  }

  ['post', 'put', 'delete'].forEach(el => {
    _this[`_${el}`] = (url, reqData, statusCode) => {
      return new Promise( (resolve, reject) => {
        request[el](`${v1}${url}`)
        .send(reqData)
        .then((res) => {
          console.log(res.body.msg);
          res.statusCode.should.equal(statusCode)
          resolve();
        })
        .catch(e => reject(e))
      })
    }
  })
}
