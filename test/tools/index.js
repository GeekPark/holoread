import app       from '../../index';
import supertest from 'supertest';
import should    from 'should';
import $         from '../../utils';
import mock      from './mock';


const v1      = '/api/v1/';
const admin   = '/api/admin/';
const request = supertest(app);

// console.log = () => {};

export {
  request,
  should,
  mock,
  app,
  v1,
  admin
}
