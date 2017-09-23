'use strict';

const _ = require('plp/rextend')(require('lodash'), [
  'class-meta',
]);
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
const mongodb = require('mongodb');

mongoose.Promise = global.Promise;

class Database {

  constructor (st = {}) {
    var self = this;

    self.st = st;
    self.url = `mongodb://${st.host || 'localhost'}/${st.db || 'lpchat'}`;
    self.connection = self.createConnection(self.url);
    self.models = st.models;
    self.collections = {};

    self.loadModels();
  }

  getCollectionsNames () {
    var self = this;
    return _
      .values(self.collections)
      .map(Model => Model.collection.collectionName);
  }

  createConnection (url) {
    var self = this,
      connection = mongoose.connect(url, {
        useMongoClient: true,
      });
    autoIncrement.initialize(connection);
    return connection;
  }

  empty () {
    var self = this;
    return mongodb
      .connect(self.url)
      .then(db => {
        return db
          .dropDatabase()
          .then(() => db.close());
      });
  }

  loadModels () {
    var self = this,
      factories = _.clone(self.models);
    _.each(factories, (factory, name) => {
      var props = {
        fields: {},
        list: {
          cls (Class) {
            _.extend(props.list, _.classMeta.methods(Class));
          },
        },
        item: {
          cls (Class) {
            _.extend(props.item, _.classMeta.methods(Class));
          },
        },
      };
      factory(setFields, props.list, props.item, self);
      props.list.Class ? props.list.cls(props.list.Class) : '';
      props.item.Class ? props.item.cls(props.item.Class) : '';
      var model = mongoose.model(name, self.createSchema(name, props));
      self[name] = self.collections[name] = model;
      function setFields(data) {
        _.extend(props.fields, data);
      }
    });
    // self.IdentityCounter
    //   = self.collections.IdentityCounter
    //   = self.connection.models.IdentityCounter;
    return self.models;
  }

  createSchema (name, props) {
    var self = this,
      schema = new Schema(props.fields);
    _.extend(schema.statics, props.list);
    _.each(props.item, (method, name) => {
      schema.methods[name] = function (...args) {
        var self = this;
        return method.call(self, self, ...args);
      };
    });
    schema.plugin(autoIncrement.plugin, {
      model: name,
      field: 'id'
    });
    return schema;
  }

}

module.exports = Database;
