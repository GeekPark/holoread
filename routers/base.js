/**
 * @author eric
 * @version 1.0.0
 */

// const allow = ['index', 'show', 'create', 'update', 'delete'];

export default class Base {
  constructor (router) {
    this.router = router
  }

  resources (resource = '', controller = {}, functions = []) {
    const router = this.router

    const resolve = function (req, res) {
      res.send('not opened')
    }

    const {
      index = resolve,
      show = resolve,
      create = resolve,
      update = resolve,
      del = resolve
    } = controller

    router.get(resource, functions, index)
    router.get(`${resource}/:id`, functions, show)
    router.post(resource, functions, create)
    router.put(`${resource}/:id`, functions, update)
    router.patch(`${resource}/:id`, functions, update)
    router.delete(`${resource}/:id`, functions, del)
    return this
  }
}
