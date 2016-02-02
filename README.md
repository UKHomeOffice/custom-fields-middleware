# Custom Fields Middleware

Adds and transforms custom fields on the response

## Usage

In Express, pass the middleware to `app.use` before the router
```js
app.use(require('custom-fields-middleware'));
```

Assign a model to `customfields` from anywhere in your app
```js

res.customfields = {
  id: 'foo',
  value: 'bar'
};
```

Assign a collection
```js
res.customfields = [{id: 'foo', value: 'bar'}, {id: 'bar', value: 'bar'}];
```

Read the value(s)
```js
res.customfields.foo // 'bar'
res.customfields.bar // 'baz'
```


### Params

- `id`: {String} required. The name of the value.
- `value`: {*} required. The value to be assigned to the id.
- `transforms`: {Array|String|Function} options. A function or list of functions to transforms the value.


### Transforms

A transform is a function that takes two arguments, the value and the request object.

```js

var square (value, req) => value * value;

res.customfields = {
  id: 'foo',
  value: 'bar',
  transforms: [square]
};
```

Built-in transforms include:

- `baseurl`: prepends the value with `req.baseUrl`

Use a built-in transform by passing the name to the `transforms` field.
```js
res.customfields = {
  id: 'foo',
  value: 'bar',
  transforms: ['baseurl']
};
```

### Install

```bash
$ npm install custom-fields-middleware --save
```

### Scripts
```bash
$ npm test
```

```bash
$ npm lint
```
