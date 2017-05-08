/**
 * @author eric
 * @version 1.0.0
 */


import mongoose from 'mongoose';
import $        from '../utils';


const rules  = [];


// baseModel
export default class Base {

  constructor(name, options) {

    const schema = mongoose.Schema(options, {
      versionKey: false,
      toObject:   { virtuals: true },
      toJSON:     { virtuals: true },
      timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
    })

    schema.virtual('created_at').get(function (doc) {
      return $.dateformat(this.createdAt);
    });
    schema.virtual('updated_at').get(function () {
      return $.dateformat(this.updatedAt);
    });
    schema.options.toObject.transform = function (doc, ret, options) {
      delete ret.id;
    };
    schema.options.toJSON.transform = function (doc, ret, options) {
      delete ret.id;
    };

    this.schema  = schema;
    this.model   = mongoose.model(name, schema);
    this.methods = addMethods(this);
  };

  static ObjectId() {
    return mongoose.Schema.ObjectId;
  };

  // try catch methods
  async all(query, options) {
    const _count  = 20;
    const {_start = 0} = options;
    try {
      return await this.model.find(query)
        .limit(_count).skip(_count * _start)
        .populate(rules).sort({createdAt: -1});
    } catch (e) {
      console.error(e);
    }
  };

  async find(query, options) {
    try {
      return await this.model.findOne(query)
        .populate(rules);
    } catch (e) {
      console.error(e);
    }
  };

  async create(query) {
    try {
      return await this.model.create(query);
    } catch (e) {
      console.error(e);
    }
  };

  async updateBy(query, info) {
    try {
      return await this.model.update(query, { $set: info })
    } catch (e) {
      console.error(e);
    }
  };

  async update(query) {
    try {
      return await query.save();
    } catch (e) {
      console.error(e);
    }
  };

  async deleteBy(query) {
    try {
      return await this.model.remove(query);
    } catch (e) {
      console.error(e);
    }
  };

  async delete(query) {
    try {
      return await query.remove();
    } catch (e) {
      console.error(e);
    }
  };

}


function addMethods (_this) {

  const methods = {};

  methods.count = async function (query) {
    return await _this.model.count(query);
  };

  methods.all = async function (query, options) {
    return await _this.all(query, options);
  };

  methods.find = async function (query) {
    return await _this.find(query);
  };

  methods.findById = async function (id) {
    return await _this.find({ _id: id });
  };

  methods.create = async function (query) {
    return await _this.create(query);
  };

  methods.update = async function (query, info) {
    const item = await _this.find(query);
    if (!item) { return -1; }
    return await _this.update(query, info);
  };

  methods.delete = async function (query) {
    const item = await _this.find(query);
    if (!item) { return -1;}
    return await _this.delete(item);
  };

  return methods;
}
