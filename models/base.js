/**
 * @author eric
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import $ from '../utils'

const rules = []

// baseModel
export default class Base {
  constructor (name, options) {
    const schema = mongoose.Schema(options, {
      versionKey: false,
      id: false,
      toObject: { virtuals: true, getters: true },
      toJSON: { virtuals: true, getters: true },
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    })

    schema.virtual('created_at').get(function (doc) {
      return $.dateformat(this.createdAt)
    })
    schema.virtual('updated_at').get(function () {
      return $.dateformat(this.updatedAt)
    })

    this.schema = schema
    this.model = mongoose.model(name, schema)
    addMethods(this)
  };

  static ObjectId () {
    return mongoose.Schema.ObjectId
  };

  // try catch methods
  async all (query, options) {
    const {start = 0, limit = 20} = options

    try {
      return await this.model.find(query)
        .limit(limit).skip(start * limit)
        .populate(rules).sort({createdAt: -1})
    } catch (e) {
      console.error(e)
    }
  };

  async find (query, options) {
    try {
      return await this.model.findOne(query)
    } catch (e) {
      console.error(e)
    }
  };

  async create (query) {
    try {
      return await this.model.create(query)
    } catch (e) {
      console.error(e)
    }
  };

  async updateBy (query, info) {
    try {
      return await this.model.update(query, { $set: info })
    } catch (e) {
      console.error(e)
    }
  };

  async update (query) {
    try {
      return await query.save()
    } catch (e) {
      console.error(e)
    }
  };

  async deleteBy (query) {
    try {
      return await this.model.remove(query)
    } catch (e) {
      console.error(e)
    }
  };

  async delete (query) {
    try {
      return await query.remove()
    } catch (e) {
      console.error(e)
    }
  };
}

function addMethods (_this) {
  _this.count = async function (query) {
    const count = await _this.model.count(query)
    return count
  }

  // _this.all = async function (query, options) {
  //   return await _this.all(query, options);
  // };

  // _this.find = async function (query) {
  //   return await _this.find(query);
  // };

  _this.findById = async function (id) {
    const result = await _this.find({ _id: id })
    return result
  }

  // _this.create = async function (query) {
  //   return await _this.create(query);
  // };

  // _this.updateBy = async function (query, info) {
  //   return await _this.updateBy(query, info);
  // };

  // _this.update = async function (query, info) {
  //   return await _this.update(query, info);
  // };

  // _this.delete = async function (query) {
  //   const item = await _this.find(query);
  //   if (!item) { return -1;}
  //   return await _this.delete(item);
  // };

  return _this
}
