'use strict';

const lib = require('./lib');

var db = lib('lpchat', require('../../lpchat/lpchat-models/models'));

db.User
  .find({})
  .then(console.log);
