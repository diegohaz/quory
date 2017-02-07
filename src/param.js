// @flow
import { isSet } from './utils'

type ValidatorObject = {
  validator: Function,
  message?: string,
  msg?: string
}

type ValidatorOptionObject = {
  option: any,
  message?: string
}

type ValidationResultObject = {
  valid: boolean,
  message?: string,
  name?: string,
  param: string,
  value: any
}

export default class Param {
  options: Object

  parsers = {
    type: (value: any, option: any = this.option('type')): any => {
      if (Array.isArray(option)) {
        return (Array.isArray(value) ? value : [value])
          .map(val => this.parsers.type(val, option[0]))
      }
      switch (option.name) {
        case 'RegExp': return new RegExp(value, 'i')
        case 'Date': return new Date(/^\d{5,}$/.test(value) ? Number(value) : value)
        case 'Boolean': return !(value === 'false' || value === '0' || !value)
        case 'Number': return Number(value)
        case 'Object': return Object(value)
        default: return String(value)
      }
    },

    set: (value: any): any => {
      const option = this.option('set')
      if (typeof option === 'function') {
        return option(value)
      }
      throw new Error('[quory] `set` option must be a function')
    },

    get: (value: any): any => {
      const option = this.option('get')
      if (typeof option === 'function') {
        return option(value)
      }
      throw new Error('[quory] `get` option must be a function')
    },

    default: (value: any): any => isSet(value) ? this.option('default') : value
  }

  validators = {
    required: [(value: any): boolean => {
      const { option } = this.parseValidatorOption(this.option('required'))
      return !option || isSet(value)
    }, '{PATH} parameter is required'],

    max: [(value: number | Date): boolean => {
      const { option } = this.parseValidatorOption(this.option('max'))
      return typeof option === 'undefined' || !isSet(value) || value <= option
    }, '{PATH} parameter must be lower or equal to {MAX}'],

    min: [(value: number | Date): boolean => {
      const { option } = this.parseValidatorOption(this.option('min'))
      return typeof option === 'undefined' || !isSet(value) || value >= option
    }, '{PATH} parameter must be greater or equal to {MIN}']
  }

  parseValidator = (validator: Function | ValidatorObject | any[]): ValidatorObject => {
    if (typeof validator === 'function') {
      return { validator }
    } else if (Array.isArray(validator)) {
      return { validator: validator[0], message: validator[1] }
    }
    return {
      ...validator,
      msg: validator.msg || validator.message,
      message: validator.msg || validator.message
    }
  }

  parseValidatorOption = (option: any): ValidatorOptionObject => {
    if (Array.isArray(option)) {
      return {
        option: option[0],
        message: option[1]
      }
    } else if (typeof option === 'string') {
      return {
        option: true,
        message: option
      }
    }
    return { option }
  }

  constructor(name: string, options: Object | Function | any = {}) {
    if (typeof options === 'function') {
      options = { type: options }
    } else if (typeof options !== 'object') {
      options = { default: options }
    }

    this.options = {
      set: value => value,
      get: value => value,
      name,
      ...options
    }
  }

  /**
   * Gets/sets param option
   */
  option(name: string, value?: any): any {
    if (typeof value !== 'undefined') {
      this.options[name] = value
      return this
    }
    return this.options[name]
  }

  /**
   * Parses param
   */
  parse(value: any): Object {
    const name = this.option('name')
    const object = { [name]: value }
    Object.keys(this.options).forEach((optionName) => {
      const fn = this.parsers[optionName]
      if (fn) {
        object[name] = fn(object[name])
      }
    })
    return object
  }

  /**
   * Validates param
   */
  validate(value: any): Promise<ValidationResultObject> {
    const name = this.option('name')
    const parsedValue = this.parse(value)[name]
    let result = {
      param: name,
      valid: true,
      value
    }

    Object.keys(this.validators).forEach((validatorName) => {
      if (!result.valid) return
      const {
        validator,
        message: defaultMessage
      } = this.parseValidator(this.validators[validatorName])
      const {
        option,
        message = defaultMessage
      } = this.parseValidatorOption(this.option(validatorName))

      if (!validator(parsedValue)) {
        result = {
          ...result,
          valid: false,
          name: validatorName,
          [validatorName]: option,
          message
        }
      }
    })

    return new Promise((resolve, reject) => result.valid ? resolve(result) : reject(result))
  }

}
