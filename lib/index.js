'use strict';

const _ = require('lodash');
const Database = require('./database');
const moment = require('moment');

const state = {
  dbs: {},
};

moment.locale('ru');

module.exports = connect;

function connect(dbName = 'lpchat', models) {
  var key = `${dbName}-${_.keys(models).sort().join('-')}`,
    db = state.dbs[key] || new Database({
      host: 'localhost',
      db: dbName,
      models: models,
    });
  state.dbs[key] = db;
  return db;
}
