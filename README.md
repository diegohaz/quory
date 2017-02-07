# quory

[![Generated with nod](https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square)](https://github.com/diegohaz/nod)
[![NPM version](https://img.shields.io/npm/v/quory.svg?style=flat-square)](https://npmjs.org/package/quory)
[![Build Status](https://img.shields.io/travis/quory/quory/master.svg?style=flat-square)](https://travis-ci.org/quory/quory) [![Coverage Status](https://img.shields.io/codecov/c/github/quory/quory/master.svg?style=flat-square)](https://codecov.io/gh/quory/quory/branch/master)

**Quory** is a highly abstract library to validate and parse plain JavaScript objects inspired by [mongoose](https://github.com/Automattic/mongoose) schemas.

## Install

    $ yarn add quory

## Usage

Because of its abstraction, you can use Quory in many different ways to solve different problems. Let's see a very basic example:

```js
import Quory from 'quory'

const schema = new Quory({
  name: {
    type: String,
    default: 'Shakira',
    validate: value => value !== 'Britney'
  } 
})

schema.validate({ name: 'Britney' }) // returns a rejected Promise
schema.validate() // returns a fulfilled promise

schema.parse({ name: 'Britney' }) // returns { name: 'Britney' }
schema.parse() // returns { name: 'Shakira' }
```

The above example is exactly what Quory is, that simple. It was built this way so the community can use it to create different solutions, but it was primarily designed to solve a common problem: validation and parsing of query/body (quory) objects on HTTP requests.

To achieve that and many other functionalities, we count on [**Decorators**](#decorators) and [**Injectable Schemas**](#injectable-schemas) created by the community.

With the [`quory-express`](link) decorator, for example, we can use Quory as an express middleware so it will validate/parse values from request query/body objects:

```js
import { query, body } from 'quory-express'

app.get('/',
  query({
    afterDate: {
      type: Date,
      default: Date.now
    }
  }),
  (req, res) => {
    // req.quory will be the Quory schema object
    // quory-express will call req.quory.validate(req.query) before calling the next middleware
    // req.query will be the result of req.quory.parse(req.query)
  }
)

app.post('/',
  body({
    title: String,
    desc: String
  }),
  (req, res) => {
    // req.quory will be the Quory schema object
    // quory-express will call req.quory.validate(req.body) before calling the next middleware
    // req.body will be the result of req.quory.parse(req.body)
  }
)
```

With the [`quory-mongoose`](link) decorator, we can easily extract Mongoose query arguments from a Quory object:

```js
import { query, body } from 'quory-express'
import quoryMongoose from 'quory-mongoose'

app.get('/',
  query({
    afterDate: {
      type: Date,
      default: Date.now,
      // properties interpreted by quory-mongoose
      bindTo: 'conditions',
      paths: ['createdAt'],
      operator: '$gte'
    }
  }),
  (req, res) => {
    const { conditions, projection, options } = quoryMongoose(req.quory).parse(req.query)
    // conditions will be { createdAt: { $gte: req.query.afterDate } }
    Post.find(conditions, projection, options)
  }
)
```

With the [injectable schemas](#injectable-schemas), we can easily share common schema parameters within our application:

```js
import { query, body } from 'quory-express'
import quoryMongoose from 'quory-mongoose'
import pagination from 'quory-mongoose-pagination'

app.get('/',
  query({
    name: String,
    ...pagination({ limit: { name: 'max' } })
  }),
  (req, res) => {
    const { conditions, projection, options } = quoryMongoose(req.quory).parse(req.query)
    // options will be { limit: req.query.max, skip: req.query.page * limit }
    Post.find(conditions, projection, options)
  }
)
```

```js
import Quory from 'quory'
import { body, query } from 'quory-express'
import quoryMongoose from 'quory-mongoose'
import near from 'quory-mongoose-near'
import fields from 'quory-mongoose-fields'
import pagination from 'quory-mongoose-pagination'

app.get('/', 
  query({ 
    name: {
      type: String,
      mongoose: 'projection'
    }, 
    ...fields(), 
    ...near(), 
    ...pagination({ limit: { max: 200 } }) 
  }),
  (req, res) => {
    // req.query = req.quory.parse(req.query)
    const { conditions, projection, options } = quoryMongoose(req.quory).parse(req.query)
    return User.find(conditions, projection, options)
  }
)

// new Quory(...schemas: Array<Object>)

const schema = new Quory({
  name: {
    type: String,
    paths: ['foo', 'bar'],
    set: (val, param) => val,
    get: (val, param) => val,
    validate: [val => val === 'something', 'Uh oh, {PATH} does not equal "something".'],
  }
}, {
  name: 'foo'
})
schema.params

schema.param('name')
schema.param('name', {
  type: String,
  validate: [val => val === 'something', 'Uh oh, {PATH} does not equal "something".'],
})
schema.param('name').options
schema.param('name').option('type')
schema.param('name').option('type', Number)
schema.param('name').set(val => val)
schema.param('name').get(val => val)
schema.param('name').default(val => val)
schema.param('name').validate(val => val === 'something', 'Uh oh, {PATH} does not equal "something".')

schema.validate({ name: 'test' }).then((errObject))...

schema.parse({ name: 'test' })
// { foo: 'test', bar: 'test' }
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### sayHello

This function says hello.

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** Some name to say hello for.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The hello.

## License

MIT © [Diego Haz](https://github.com/diegohaz)
