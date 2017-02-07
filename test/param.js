import Param from '../src/param'

const param = options => new Param('foo', options)

describe('constructor', () => {
  it('infers name', () => {
    expect(param().option('name')).toBe('foo')
  })

  it('infers type', () => {
    expect(param(String).option('type')).toEqual(String)
  })

  it('infers default value and type', () => {
    expect(param('bar').option('type')).toEqual(String)
    expect(param('bar').option('default')).toBe('bar')
  })

  it('infers default value and type as array', () => {
    expect(param(['bar']).option('type')).toEqual([String])
    expect(param(['bar']).option('default')).toBe(['bar'])
  })
})

describe('option', () => {
  it('retrieves option defined in constructor', () => {
    expect(param({ type: String }).option('type')).toEqual(String)
  })

  it('retrieves Param instance when setting option', () => {
    expect(param().option('type', Number)).toBeInstanceOf(Param)
  })

  it('defines option and retrieves param', () => {
    expect(param().option('type', Number).option('type')).toEqual(Number)
  })
})

describe('type', () => {
  it('retrieves type option defined in constructor', () => {
    expect(param({ type: Number }).option('type')).toEqual(Number)
  })

  it('defines type option and retrieves param', () => {
    expect(param().option('type', Number).option('type')).toEqual(Number)
  })

  it('parses String type', () => {
    expect(param({ type: String }).parse('a').foo).toBe('a')
    expect(param({ type: String }).parse(1).foo).toBe('1')
  })

  it('parses Array type', () => {
    expect(param({ type: [String] }).parse('a').foo).toEqual(['a'])
    expect(param({ type: [String] }).parse(1).foo).toEqual(['1'])
    expect(param({ type: [String] }).parse([1, 2]).foo).toEqual(['1', '2'])
  })

  it('parses Number type', () => {
    expect(param({ type: Number }).parse(1).foo).toBe(1)
    expect(param({ type: Number }).parse('1').foo).toBe(1)
  })

  it('parses Boolean type', () => {
    expect(param({ type: Boolean }).parse(1).foo).toBe(true)
    expect(param({ type: Boolean }).parse(0).foo).toBe(false)
    expect(param({ type: Boolean }).parse('1').foo).toBe(true)
    expect(param({ type: Boolean }).parse('0').foo).toBe(false)
  })

  it('parses RegExp type', () => {
    expect(param({ type: RegExp }).parse('test').foo).toEqual(/test/i)
    expect(param({ type: RegExp }).parse(123).foo).toEqual(/123/i)
  })

  it('parses Date type', () => {
    expect(param({ type: Date }).parse('2016-04-24').foo).toEqual(new Date('2016-04-24'))
    expect(param({ type: Date }).parse('1461456000000').foo).toEqual(new Date('2016-04-24'))
    expect(param({ type: Date }).parse(1461456000000).foo).toEqual(new Date('2016-04-24'))
  })
})

describe('name', () => {
  it('retrieves name option defined in constructor', () => {
    expect(param({ name: 'a' }).option('name')).toBe('a')
  })

  it('defines name option and retrieves param', () => {
    expect(param().option('name', 'a').option('name')).toEqual('a')
  })

  it('parses name option', () => {
    expect(param({ name: 'a' }).parse('bar')).toEqual({ a: 'bar' })
  })
})

describe('set', () => {
  it('retrieves set option defined in constructor', () => {
    const set = jest.fn()
    expect(param({ set }).option('set')).toBe(set)
    expect(set).not.toBeCalled()
  })

  it('defines set option and retrieves param', () => {
    const set = jest.fn()
    expect(param().option('set', set).option('set')).toBe(set)
    expect(set).not.toBeCalled()
  })

  it('parses set option', () => {
    const set = jest.fn(val => `${val}!`)
    expect(param({ set }).parse('test')).toEqual({ foo: 'test!' })
    expect(set).toHaveBeenCalledWith('test')
  })

  it('throws when set option is not a function', () => {
    const set = ''
    expect(() => param({ set }).parse('test')).toThrow()
  })
})

describe('get', () => {
  it('retrieves get option defined in constructor', () => {
    const get = jest.fn()
    expect(param({ get }).option('get')).toBe(get)
    expect(get).not.toBeCalled()
  })

  it('defines get option and retrieves param', () => {
    const get = jest.fn()
    expect(param().option('get', get).option('get')).toEqual(get)
    expect(get).not.toBeCalled()
  })

  it('parses get option', () => {
    const get = jest.fn(val => `${val}!`)
    expect(param({ get }).parse('test')).toEqual({ foo: 'test!' })
    expect(get).toHaveBeenCalledWith('test')
  })

  it('throws when get option is not a function', () => {
    const get = ''
    expect(() => param({ get }).parse('test')).toThrow()
  })
})

describe('default', () => {
  it('retrieves default option defined in constructor', () => {
    expect(param({ default: 'bar' }).option('default')).toBe('bar')
  })

  it('retrieves default option defined as function in constructor', () => {
    const fn = jest.fn()
    expect(param({ default: fn }).option('default')).toBe(fn)
    expect(fn).not.toBeCalled()
  })

  it('defines default option and retrieves param', () => {
    expect(param().option('default', 'bar').option('default')).toBe('bar')
  })

  it('retrieves default option defined as function in option', () => {
    const fn = jest.fn()
    expect(param().option('default', fn).option('default')).toBe(fn)
    expect(fn).not.toBeCalled()
  })

  it('parses default option', () => {
    expect(param({ default: 'bar' }).parse()).toEqual({ foo: 'bar' })
    expect(param({ default: 'bar' }).parse('test')).toEqual({ foo: 'test' })
  })
})

describe('lowercase', () => {
  it('retrieves lowercase option defined in constructor', () => {
    expect(param({ lowercase: false }).option('lowercase')).toBe(false)
    expect(param({ lowercase: true }).option('lowercase')).toBe(true)
  })

  it('defines lowercase option and retrieves param', () => {
    expect(param().option('lowercase', false).option('lowercase')).toBe(false)
    expect(param().option('lowercase', true).option('lowercase')).toBe(true)
  })

  it('parses lowercase option', () => {
    expect(param({ lowercase: false }).parse('BAR')).toEqual({ foo: 'BAR' })
    expect(param({ lowercase: true }).parse('BAR')).toEqual({ foo: 'bar' })
  })
})

describe('uppercase', () => {
  it('retrieves uppercase option defined in constructor', () => {
    expect(param({ uppercase: false }).option('uppercase')).toBe(false)
    expect(param({ uppercase: true }).option('uppercase')).toBe(true)
  })

  it('defines uppercase option and retrieves param', () => {
    expect(param().option('uppercase', false).option('uppercase')).toBe(false)
    expect(param().option('uppercase', true).option('uppercase')).toBe(true)
  })

  it('parses uppercase option', () => {
    expect(param({ uppercase: false }).parse('bar')).toEqual({ foo: 'bar' })
    expect(param({ uppercase: true }).parse('bar')).toEqual({ foo: 'BAR' })
  })
})

describe('trim', () => {
  it('retrieves trim option defined in constructor', () => {
    expect(param({ trim: false }).option('trim')).toBe(false)
    expect(param({ trim: true }).option('trim')).toBe(true)
  })

  it('defines trim option and retrieves param', () => {
    expect(param().option('trim', false).option('trim')).toBe(false)
    expect(param().option('trim', true).option('trim')).toBe(true)
  })

  it('parses trim option', () => {
    expect(param({ trim: false }).parse('  bar ')).toEqual({ foo: '  bar ' })
    expect(param({ trim: true }).parse('  bar ')).toEqual({ foo: 'bar' })
  })
})

describe('required', () => {
  it('retrieves required option defined in constructor', () => {
    expect(param({ required: false }).option('required')).toBe(false)
    expect(param({ required: true }).option('required')).toBe(true)
  })

  it('defines required option and retrieves param', () => {
    expect(param().option('required', false).option('required')).toBe(false)
    expect(param().option('required', true).option('required')).toBe(true)
  })

  it('retrieves required option defined as string', () => {
    expect(param({ required: 'required' }).option('required')).toBe('required')
  })

  it('fails when validating required option', () => {
    expect.assertions(1)
    return param({ required: true }).validate().catch(err => expect(err).toBeTruthy())
  })

  it('fails when validating required option defined as string', () => {
    expect.assertions(1)
    return param({ required: 'required' })
      .validate()
      .catch(err => expect(err.message).toBe('required'))
  })

  it('passes when validating required option', () =>
    param({ required: true }).validate('bar')
  )
})

describe('max', () => {
  it('retrieves max option defined in constructor', () => {
    expect(param({ max: 100 }).option('max')).toBe(100)
  })

  it('defines max option and retrieves param', () => {
    expect(param().option('max', 100).option('max')).toBe(100)
  })

  it('retrieves max option defined as array', () => {
    expect(param({ max: [100, 'ops'] }).option('max')).toEqual([100, 'ops'])
  })

  describe('type Number', () => {
    it('fails when validating max option', () => {
      expect.assertions(1)
      return param({ type: Number, max: 100 }).validate(101).catch(err => expect(err).toBeTruthy())
    })

    it('fails when validating max option defined as array', () => {
      expect.assertions(1)
      return param({ type: Number, max: [100, 'ops'] })
        .validate(101)
        .catch(err => expect(err.message).toBe('ops'))
    })

    it('passes when validating max option', () =>
      param({ type: Number, max: 100 }).validate(100)
    )
  })

  describe('type Date', () => {
    it('fails when validating max option', () => {
      expect.assertions(1)
      return param({ type: Date, max: new Date('2016-04-24') })
        .validate('2016-04-25')
        .catch(err => expect(err).toBeTruthy())
    })

    it('fails when validating max option defined as array', () => {
      expect.assertions(1)
      return param({ type: Date, max: [new Date('2016-04-24'), 'ops'] })
        .validate('2016-04-25')
        .catch(err => expect(err.message).toBe('ops'))
    })

    it('passes when validating max option', () =>
      param({ type: Date, max: new Date('2016-04-24') }).validate('2016-04-24')
    )
  })
})

describe('min', () => {
  it('retrieves min option defined in constructor', () => {
    expect(param({ min: 100 }).option('min')).toBe(100)
  })

  it('defines min option and retrieves param', () => {
    expect(param().option('min', 100).option('min')).toBe(100)
  })

  it('retrieves min option defined as array', () => {
    expect(param({ min: [100, 'ops'] }).option('min')).toEqual([100, 'ops'])
  })

  describe('type Number', () => {
    it('fails when validating min option', () => {
      expect.assertions(1)
      return param({ type: Number, min: 100 }).validate(99).catch(err => expect(err).toBeTruthy())
    })

    it('fails when validating min option defined as array', () => {
      expect.assertions(1)
      return param({ type: Number, min: [100, 'ops'] })
        .validate(99)
        .catch(err => expect(err.message).toBe('ops'))
    })

    it('passes when validating min option', () =>
      param({ type: Number, min: 100 }).validate(100)
    )
  })

  describe('type Date', () => {
    it('fails when validating min option', () => {
      expect.assertions(1)
      return param({ type: Date, min: new Date('2016-04-24') })
        .validate('2016-04-23')
        .catch(err => expect(err).toBeTruthy())
    })

    it('fails when validating min option defined as array', () => {
      expect.assertions(1)
      return param({ type: Date, min: [new Date('2016-04-24'), 'ops'] })
        .validate('2016-04-23')
        .catch(err => expect(err.message).toBe('ops'))
    })

    it('passes when validating min option', () =>
      param({ type: Date, min: new Date('2016-04-24') }).validate('2016-04-24')
    )
  })
})

describe('enum', () => {
  it('retrieves enum option defined in constructor', () => {
    expect(param({ enum: ['bar', 'baz'] }).option('enum')).toEqual(['bar', 'baz'])
  })

  it('defines enum option and retrieves param', () => {
    expect(param().option('enum', ['bar', 'baz']).option('enum')).toEqual(['bar', 'baz'])
  })

  it('retrieves enum option defined as object', () => {
    const enumeration = {
      values: ['bar', 'baz'],
      message: 'ops'
    }
    expect(param({ enum: enumeration }).option('enum')).toBe(enumeration)
  })

  it('fails when validating enum option', () => {
    expect.assertions(1)
    return param({ enum: ['bar', 'baz'] }).validate('a').catch(err => expect(err).toBeTruthy())
  })

  it('fails when validating enum option defined as object', () => {
    expect.assertions(1)
    return param({ enum: {
      values: ['bar', 'baz'],
      message: 'ops'
    } }).validate('a').catch(err => expect(err.message).toBe('ops'))
  })

  it('passes when validating enum option', () =>
    param({ enum: ['bar', 'baz'] }).validate('bar')
  )
})

describe('match', () => {
  it('retrieves match option defined in constructor', () => {
    expect(param({ match: /^[a-z]$/i }).option('match')).toEqual(/^[a-z]$/i)
  })

  it('defines match option and retrieves param', () => {
    expect(param().option('match', /^[a-z]$/i).option('match')).toEqual(/^[a-z]$/i)
  })

  it('retrieves match option defined as array', () => {
    expect(param({ match: [/^[a-z]$/i, 'ops'] }).option('match')).toEqual([/^[a-z]$/i, 'ops'])
  })

  it('fails when validating match option', () => {
    expect.assertions(1)
    return param({ match: /^[a-z]$/i })
      .validate('123')
      .catch(err => expect(err).toBeTruthy())
  })

  it('fails when validating match option defined as array', () => {
    expect.assertions(1)
    return param({ match: [/^[a-z]$/i, 'ops'] })
      .validate('123')
      .catch(err => expect(err.message).toBe('ops'))
  })

  it('passes when validating match option', () =>
    param({ match: /^[a-z]$/i }).validate('abc')
  )
})

describe('maxlength', () => {
  it('retrieves maxlength option defined in constructor', () => {
    expect(param({ maxlength: 1 }).option('maxlength')).toBe(1)
  })

  it('defines maxlength option and retrieves param', () => {
    expect(param().option('maxlength', 1).option('maxlength')).toBe(1)
  })

  it('retrieves maxlength option defined as array', () => {
    expect(param({ maxlength: [1, 'ops'] }).option('maxlength')).toEqual([1, 'ops'])
  })

  it('fails when validating maxlength option', () => {
    expect.assertions(1)
    return param({ maxlength: 1 })
      .validate('ab')
      .catch(err => expect(err).toBeTruthy())
  })

  it('fails when validating maxlength option defined as array', () => {
    expect.assertions(1)
    return param({ maxlength: [1, 'ops'] })
      .validate('ab')
      .catch(err => expect(err.message).toBe('ops'))
  })

  it('passes when validating maxlength option', () =>
    param({ maxlength: 1 }).validate('a')
  )
})

describe('minlength', () => {
  it('retrieves minlength option defined in constructor', () => {
    expect(param({ minlength: 2 }).option('minlength')).toBe(2)
  })

  it('defines minlength option and retrieves param', () => {
    expect(param().option('minlength', 2).option('minlength')).toBe(2)
  })

  it('retrieves minlength option defined as array', () => {
    expect(param({ minlength: [2, 'ops'] }).option('minlength')).toEqual([2, 'ops'])
  })

  it('fails when validating minlength option', () => {
    expect.assertions(1)
    return param({ minlength: 2 })
      .validate('a')
      .catch(err => expect(err).toBeTruthy())
  })

  it('fails when validating minlength option defined as array', () => {
    expect.assertions(1)
    return param({ minlength: [2, 'ops'] })
      .validate('a')
      .catch(err => expect(err.message).toBe('ops'))
  })

  it('passes when validating minlength option', () =>
    param({ minlength: 2 }).validate('ab')
  )
})

describe('validate', () => {
  it('retrieves validate option defined in constructor', () => {
    const validate = jest.fn()
    expect(param({ validate }).option('validate')).toBe(validate)
    expect(validate).not.toBeCalled()
  })

  it('defines validate option and retrieves param', () => {
    const validate = jest.fn()
    expect(param().option('validate', validate).option('validate')).toBe(validate)
    expect(validate).not.toBeCalled()
  })

  it('retrieves validate option defined as array', () => {
    const validate = jest.fn()
    expect(param({ validate: [validate, 'ops'] }).option('validate')).toEqual([validate, 'ops'])
    expect(validate).not.toBeCalled()
  })

  it('retrieves validate option defined as object (multiple)', () => {
    const validator1 = jest.fn()
    const validator2 = jest.fn()
    const validate = [
      { validator: validator1, msg: 'ops1' },
      { validator: validator2, msg: 'ops2' }
    ]
    expect(param({ validate }).option('validate')).toBe(validate)
    expect(validator1).not.toBeCalled()
    expect(validator2).not.toBeCalled()
  })

  it('fails when validating validate option', () => {
    const validate = jest.fn(val => val !== 'test')
    expect.assertions(2)
    return param({ validate })
      .validate('a')
      .catch((err) => {
        expect(err).toBeTruthy()
        expect(validate).toHaveBeenCalledWith('a')
      })
  })

  it('fails when validating validate option defined as array', () => {
    const validator = jest.fn(val => val !== 'test')
    const validate = [validator, 'ops']
    expect.assertions(2)
    return param({ validate })
      .validate('a')
      .catch((err) => {
        expect(err.message).toBe('ops')
        expect(validator).toHaveBeenCalledWith('a')
      })
  })

  it('fails when validating validate option with callback', () => {
    const validator = jest.fn((val, cb) => {
      cb(val !== 'test', 'use this')
    })
    const validate = [validator, 'ops']
    expect.assertions(2)
    return param({ validate })
      .validate('a')
      .catch((err) => {
        expect(err.message).toBe('use this')
        expect(validator).toHaveBeenCalledWith('a')
      })
  })

  it('fails at the first validator when validating validate option defined as object (multiple)', () => {
    const validator1 = jest.fn(val => val !== 'a')
    const validator2 = jest.fn(val => val !== 'b')
    const validate = [
      { validator: validator1, msg: 'ops' },
      { validator: validator2, msg: 'ops' }
    ]
    expect.assertions(3)
    return param({ validate })
      .validate('a')
      .catch((err) => {
        expect(err.message).toBe('ops1')
        expect(validator1).toHaveBeenCalledWith('a')
        expect(validator2).not.toBeCalled()
      })
  })

  it('fails at the second validator when validating validate option defined as object (multiple)', () => {
    const validator1 = jest.fn(val => val !== 'a')
    const validator2 = jest.fn(val => val !== 'b')
    const validate = [
      { validator: validator1, msg: 'ops1' },
      { validator: validator2, msg: 'ops2' }
    ]
    expect.assertions(3)
    return param({ validate })
      .validate('b')
      .catch((err) => {
        expect(err.message).toBe('ops2')
        expect(validator1).toHaveBeenCalledWith('b')
        expect(validator2).toHaveBeenCalledWith('b')
      })
  })

  it('passes when validating validate option', () => {
    const validate = jest.fn(val => val !== 'a')
    return param({ validate })
      .validate('b')
      .then(() => expect(validate).toHaveBeenCalledWith('b'))
  })

  it('passes when validating validate option with callback', () => {
    const validate = jest.fn((val, cb) => {
      cb(val !== 'test')
    })
    return param({ validate })
      .validate('a')
      .then(() => expect(validate).toHaveBeenCalledWith('a'))
  })

  it('passes when validating validate option defined as object (multiple)', () => {
    const validator1 = jest.fn(val => val !== 'a')
    const validator2 = jest.fn(val => val !== 'b')
    const validate = [
      { validator: validator1, msg: 'ops1' },
      { validator: validator2, msg: 'ops2' }
    ]
    return param({ validate })
      .validate('b')
      .then(() => {
        expect(validator1).toHaveBeenCalledWith('b')
        expect(validator2).toHaveBeenCalledWith('b')
      })
  })

  describe('messages', () => {
    it('replaces {PATH}', () => {
      expect.assertions(1)
      return param({ validate: [() => false, 'The {PATH} is wrong'] })
        .validate()
        .catch(err => expect(err.message).toBe('The foo is wrong'))
    })

    it('replaces {PARAM}', () => {
      expect.assertions(1)
      return param({ validate: [() => false, 'The {PARAM} is wrong'] })
        .validate()
        .catch(err => expect(err.message).toBe('The foo is wrong'))
    })

    it('replaces {VALUE}', () => {
      expect.assertions(1)
      return param({ validate: [() => false, 'The {VALUE} is wrong'] })
        .validate('bar')
        .catch(err => expect(err.message).toBe('The bar is wrong'))
    })
  })
})
