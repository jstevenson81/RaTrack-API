import * as _ from 'lodash';

import { IModelValidator, IUser, IValidationResponse } from '../../../interfaces';
import { inList, isNumber, minMax, required } from '../validators';

/**
 * Validates a user model
 */
class UserValidator implements IModelValidator {
  /**
   * Validates a user model
   * @param {IUserDocument} model This is the model we are validating
   */
  validate = (model: IUser): Array<IValidationResponse> => {
    const responses: Array<IValidationResponse> = [];
    responses.push(required(model.userName, 'userName'));
    responses.push(required(model.firstName, 'firstName'));
    responses.push(required(model.lastName, 'lastName'));
    responses.push(required(model.mobilePhone, 'mobilePhone'));

    responses.push(required(model.age, 'age'));
    responses.push(isNumber(model.age, 'age'));
    responses.push(minMax(model.age, 'age', 1, 100));

    responses.push(required(model.gender, 'gender'));
    responses.push(inList(model.gender, 'gender', ['M', 'F', 'U']));

    return _.filter(responses, (r: IValidationResponse) => {
      return r.valid === false;
    });
  };
}

export default UserValidator;
