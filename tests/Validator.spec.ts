import * as _ from 'lodash';

import UserValidator from '../common/bus/validation/modelValidators/userValidator';
import { IUser, IValidationResponse } from '../common/interfaces';

const model: IUser = {
  userName: 'test',
  firstName: 'test',
  lastName: 'test',
  gender: 'M',
  age: '23',
  id: '124',
  mobilePhone: '5044300812',
  feelings: [],
  activities: []
};

describe('User model validator tests', () => {
  it('a user should have a user name', () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.userName = '';
    const responses = userValidator.validate(localModel);
    const expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'userName';
    });
    expect(expected.valid).toBeFalsy();
  });

  it('a user should have a first name', () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.firstName = '';
    const responses = userValidator.validate(localModel);
    const expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'firstName';
    });
    expect(expected.valid).toBeFalsy();
  });

  it('a user should have a last name', () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.lastName = '';
    const responses = userValidator.validate(localModel);
    const expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'lastName';
    });
    expect(expected.valid).toBeFalsy();
  });

  it('a user should have a mobile phone', () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.mobilePhone = '';
    const responses = userValidator.validate(localModel);
    const expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'mobilePhone';
    });
    expect(expected.valid).toBeFalsy();
  });

  it('a user should have an age', () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.age = '';
    const responses = userValidator.validate(localModel);
    const expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'age';
    });
    expect(expected.valid).toBeFalsy();
  });

  it("a user's age should be a number", () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.age = 'ABC';
    var responses = userValidator.validate(localModel);
    var expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'age' && r.message === 'age should be a number.';
    });
    expect(expected.valid).toBeFalsy();
    expect(expected.message).toBe('age should be a number.');
  });

  it("a user's age should be between 1 and 100", () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.age = '200';
    var responses = userValidator.validate(localModel);
    var expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'age' && r.message === 'age should be between 1 and 100.';
    });
    expect(expected.valid).toBeFalsy();
    expect(expected.message).toBe('age should be between 1 and 100.');
  });

  it('a user should have a gender', () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.gender = '';
    const responses = userValidator.validate(localModel);
    const expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'gender';
    });
    expect(expected.valid).toBeFalsy();
  });

  it("a user's gender should be M, F, or U", () => {
    const userValidator = new UserValidator();
    const localModel = Object.assign({}, model);
    localModel.gender = 'X';
    var responses = userValidator.validate(localModel);
    var expected = _.find(responses, (r: IValidationResponse) => {
      return r.field === 'gender';
    });
    expect(expected.valid).toBeFalsy();
    expect(expected.message).toContain('M');
  });
});
