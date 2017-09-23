'use strict';

const Database = require('./database');
const moment = require('moment');

moment.locale('ru');

module.exports = connect;

function connect(dbName = 'lpchat', models) {
  var db = new Database({
    host: 'localhost',
    db: dbName,
    models: models,
  });
  return db;
}
