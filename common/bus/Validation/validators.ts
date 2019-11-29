import * as _ from 'lodash';

import { IValidationResponse } from '../../interfaces';

const createResponse = (valid: boolean, field: string, message: string) => {
  const response: IValidationResponse = { field: field, message: '', valid: true };
  response.valid = valid;
  response.message = response.valid ? '' : message;
  return response;
};

/**
 * Checks for a required value on a particular field
 * @param {string} value the value we are testing
 * @param {string} field the name of the field we are validating
 * @param {string} customMessage optional custom message
 */
const required = (value: any, field: string, customMessage?: string): IValidationResponse => {
  const valid = _.isEmpty(value) === false;
  return createResponse(valid, field, customMessage || `${field} is required.`);
};

/**
 * Checks that a value is a number
 * @param {string} value the value we are testing
 * @param {string} field the name of the field we are validating
 * @param {string} customMessage optional custom message
 */
const isNumber = (value: any, field: string, customMessage?: string): IValidationResponse => {
  const valid = _.isNaN(parseInt(value)) === false;
  return createResponse(valid, field, customMessage || `${field} should be a number.`);
};

/**
 * Checks that a value is a number and is between the min and max value
 * @param {string} value the value we are testing
 * @param {string} field the name of the field we are validating
 * @param {number} min the minimum allowed value
 * @param {number} max the maximum allowed value
 * @param {string} customMessage optional custom message
 */
const minMax = (
  value: any,
  field: string,
  min: number,
  max: number,
  customMessage?: string
): IValidationResponse => {
  const valid =
    _.isNaN(parseInt(value)) === false && parseInt(value) >= min && parseInt(value) <= max;
  return createResponse(
    valid,
    field,
    customMessage || `${field} should be between ${min} and ${max}.`
  );
};

/**
 * Checks that a value is in a list of values allowed
 * @param {string} value the value we are testing
 * @param {string} field the name of the field we are validating
 * @param {Array<any>} allowed these are the allowed values
 * @param {string} customMessage optional custom message
 */
const inList = (value: any, field: string, allowed: Array<any>, customMessage?: string) => {
  const found = _.find(allowed, (v: any) => {
    return value === v;
  });
  return createResponse(
    _.isUndefined(found) === false,
    field,
    customMessage || `${field} should be in the list ${JSON.stringify(allowed)}`
  );
};

export { required, isNumber, minMax, inList };
