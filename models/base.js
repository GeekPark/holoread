/**
 * @author eric
 * @version 1.0.0
 */


import mongoose from 'mongoose';
import $        from '../utils';


const rules  = [];
const LIMIT = 20;


// baseModel
export default class Base {

  constructor(name, options) {

    const schema = mongoose.Schema(options, {
      versionKey: false,
      toObject:   { virtuals: true , getters: true},
      toJSON:     { virtuals: true , getters: true},
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
    const {pre = ''} = options;
    console.log()
    try {
      if (pre === '') {
        _query = query;
      } else {
        _query = {'_id' :{ '$gt': pre}};
      }
      return await this.model
                   .find()
                   .limit(LIMIT)
                   .populate(rules)
                   .sort({createdAt: -1});
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

  methods.updateBy = async function (query, info) {
    return await _this.updateBy(query, info);
  };

  methods.update = async function (query, info) {
    return await _this.update(query, info);
  };

  methods.delete = async function (query) {
    const item = await _this.find(query);
    if (!item) { return -1;}
    return await _this.delete(item);
  };

  return methods;
}
