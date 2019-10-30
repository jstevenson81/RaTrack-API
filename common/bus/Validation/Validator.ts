import { validate } from '@babel/types';
import _ = require('lodash');

import { IDocument, IFieldValidation, IValidationResponse, IValidator } from '../../interfaces';

/**
 * This class allows a user to run a validation routine against data
 * @property {IDocument} model This is the model we're validating
 */
class Validator {
  model: IDocument;

  /**
   * The constructor.  It requires a model to be passed.
   * @param {IDocument} model This is the model we are validating
   */
  constructor(model: IDocument) {
    this.model = model;
  }

  /**
   * This is the main method.  It runs the validation processes
   * @param {Array<IFieldValidation>} validators These are the validations that should be run on the model
   * @returns {Array<IValidationResponse>} This is a list of validations we expect to see
   */
  validate = (validators: Array<IFieldValidation>): Array<IValidationResponse> => {
    const responses: Array<IValidationResponse> = [];
    _.forEach(validators, (v: IFieldValidation) => {
      responses.push(this.validateField(v));
    });
    return responses;
  };

  /**
   * This is the main method.  It runs the validation processes
   * @param {IFieldValidation} validations These are the validations that should be run on the model
   * @returns {Array<IValidationResponse>} This is a list of validations we expect to see
   */
  validateField = (validator: IFieldValidation): IValidationResponse => {
    if (_.isEmpty(validator.validators)) throw new Error('You must pass at least one validator.');
    if (_.isEmpty(validator.field) || _.has(this.model, validator.field) === false)
      throw new Error(
        `${validator.field} is not a valid field on the model: ${JSON.stringify(this.model)}`
      );

    // order the validators in the proper order
    const orderedValidators = _.orderBy(validator.validators, ['order'], ['asc']);
    const response: IValidationResponse = { field: validator.field, messages: [], valid: true };
    _.forEach(orderedValidators, (v: IValidator) => {
      if (v.validator() === false) {
        response.messages.push(v.customMessage);
        response.valid = false;
      }
    });
    return response;
  };

  //#region validators
  required = (value: any): boolean => {
    return _.isEmpty(value);
  };
  isNumber = (value: any): boolean => {
    return _.isNumber(value);
  };
  length = (value: any, min: number, max: number): boolean => {
    return _.isNumber(value) && _.toNumber(value) >= min && _.toNumber(value) <= max;
  };
  //#endregion
}

export default Validator;
