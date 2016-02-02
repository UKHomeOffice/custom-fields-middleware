'use strict';

var transforms = require('./transforms');

var applyTransforms = (item, req, prop) => {
  item.transforms = [].concat(item.transforms);
  item.transforms.forEach((transform) => {
    if (typeof transform === 'function') {
      prop = transform(item.value, req);
    } else if (typeof transform === 'string') {
      prop = transforms[transform](item.value, req);
    } else {
      prop = item.value;
    }
  });
  return prop;
};

/* eslint callback-return:0 */
var buildFields = (item, parent, callback) => {
  var parts = item.id.split('.');
  parts.forEach((part, len) => {
    if (typeof parent[part] === "undefined" && parts.length -1 !== len) {
      parent[part] = {};
    } else if (parts.length - 1 === len) {
      if (item.transforms) {
        parent[part] = callback(parent[part]);
      } else {
        parent[part] = item.value;
      }
    }
    parent = parent[part];
  });
};

module.exports = (req, res, next) => {
  res.body = {customfields: {}};

  Object.defineProperty(res, 'customfields', {
    get: () => {
      return res.body.customfields;
    },
    set: (items) => {
      items = [].concat(items);
      items.forEach((item) => {
        var parent = res.body.customfields;
        buildFields(item, parent, () => applyTransforms.call(this, item, req));
      });
    }
  });
  return next();
};
