'use strict';

var middleware = require('../../');

describe('res.customfields', () => {
  describe('is assigned a model {id: "foo", value: "/bar"}', () => {
    var req = {
      connection: {
        encrypted: false
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/self'
    };
    var res = {};
    var next = sinon.stub();

    before(() => {
      middleware(req, res, next);
      res.customfields = {id: 'foo', value: '/bar'};
    });

    it('should assign "/bar" to res.customfields.foo', () => {
      expect(res.customfields.foo).to.equal('/bar');
    });
  });

  describe('is assigned a collection [{id: "foo", value: "/bar"}]', () => {
    var req = {
      connection: {
        encrypted: false
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/self'
    };
    var res = {};
    var next = sinon.stub();

    before(() => {
      middleware(req, res, next);
      res.customfields = [{id: 'foo', value: '/bar'}];
    });

    it('should assign "/bar" to property res.customfields.foo', () => {
      expect(res.customfields.foo).to.equal('/bar');
    });
  });

  describe('is assigned a collection of more than one item', () => {
    var req = {
      connection: {
        encrypted: false
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/'
    };
    var res = {};
    var next = sinon.stub();

    beforeEach(() => {
      middleware(req, res, next);
      res.customfields = [{id: 'foo', value: '/bar'}, {id: 'bar', value: '/baz'}];
    });

    it('should result in each item mapped to customfield', () => {
      expect(res.customfields.foo).to.equal('/bar');
      expect(res.customfields.bar).to.equal('/baz');
    });
  });

  describe('with namespaced id', () => {
    var req = {
      connection: {
        encrypted: false
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/self'
    };
    var res = {};
    var next = sinon.stub();

    before(() => {
      middleware(req, res, next);
      res.customfields = [{id: 'foo.bar.baz', value: '/bar'}];
    });

    it('should assign "/bar" to property res.customfields.foo.bar.baz', () => {
      expect(res.customfields.foo.bar.baz).to.equal('/bar');
    });
  });


  describe('values can be transformed with functions', () => {
    var req = {
      connection: {
        encrypted: false
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/'
    };
    var res = {};
    var next = sinon.stub();
    var numThree = 3;
    var numSix = 6;
    var myFunc = (value) => value * numThree;

    beforeEach(() => {
      middleware(req, res, next);
      res.customfields = [{id: 'foo', value: '2', transforms: [myFunc]}];
    });

    it('should result in each item mapped to customfield', () => {
      expect(res.customfields.foo).to.equal(numSix);
    });
  });

  describe('values can be transformed with built-in functions', () => {
    var req = {
      connection: {
        encrypted: false
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/'
    };
    var res = {};
    var next = sinon.stub();

    beforeEach(() => {
      middleware(req, res, next);
      res.customfields = [{id: 'foo', value: '/bar', transforms: ['baseurl']}];
    });

    it('should result in each item mapped to customfield', () => {
      expect(res.customfields.foo).to.equal('http://0.0.0.0/bar');
    });
  });

  describe('built-in transform respects connection encryption', () => {
    var req = {
      connection: {
        encrypted: true
      },
      headers: {
        host: '0.0.0.0'
      },
      url: '/'
    };
    var res = {};
    var next = sinon.stub();

    beforeEach(() => {
      middleware(req, res, next);
      res.customfields = [{id: 'foo', value: '/bar', transforms: ['baseurl']}];
    });

    it('should result in each item mapped to customfield', () => {
      expect(res.customfields.foo).to.equal('https://0.0.0.0/bar');
    });
  });
});
