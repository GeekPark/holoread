/**
 * @author jk
 * @version 1.0.0
 */

import express from 'express'


// const allow = ['index', 'show', 'create', 'update', 'delete'];

export default class Base {

  constructor(router) {
    this.router = router
  }

  rest (resources = '', controller = {}, functions = []) {
    const router = this.router;

    const resolve = function (req, res) {
      res.send('not opened')
    };

    const {
      index  = resolve,
      show   = resolve,
      create = resolve,
      update = resolve,
      del    = resolve,
    } = controller;

    router.get(resources,             functions, index);
    router.get(`${resources}/:id`,    functions, show);
    router.post(resources,            functions, create);
    router.put(`${resources}/:id`,    functions, update);
    router.patch(`${resources}/:id`,  functions, update);
    router.delete(`${resources}/:id`, functions, del);
    return this;
  }
}


