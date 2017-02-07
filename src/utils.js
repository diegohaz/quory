// @flow

export const isEmpty = (value: any): boolean =>
  typeof value === 'string' && value.trim() === ''

export const isNil = (value: any): boolean => value == null

export const isNaN = (value: any): boolean => Number.isNaN(value)

export const isSet = (value: any): boolean => !isEmpty(value) && !isNil(value) && !isNaN(value)
