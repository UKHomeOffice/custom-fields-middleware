'use strict';

const url = require('url');

module.exports = (value, req) => {
  var protocol = req.connection.encrypted ? 'https' : 'http';
  req.baseUrl = protocol + '://' + req.headers.host + '/';
  return url.resolve(req.baseUrl, value);
};

