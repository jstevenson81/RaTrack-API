import Validator from '../common/bus/Validation/Validator';
import { IFieldValidation, IUser } from '../common/interfaces';

const user: IUser = {
  userName: '',
  age: '130',
  gender: 'M',
  firstName: 'jonathan',
  lastName: 'test',
  mobilePhone: '+!5044300812',
  id: ''
};

describe('validation tests', () => {
  it('a validator must have at least one validation function', () => {
    const validator = new Validator(user);
    const validators: Array<IFieldValidation> = [
      {
        field: 'test',
        validators: []
      }
    ];

    expect(() => {
      validator.validate(validators);
    }).toThrowError('You must pass at least one validator.');
  });

  it('a validator field must match model fields', () => {
    const validator = new Validator(user);
    const validators: Array<IFieldValidation> = [
      {
        field: 'test',
        validators: [
          {
            order: 1,
            customMessage: 'test is required',
            validator: () => {
              return validator.required('blah');
            }
          }
        ]
      }
    ];

    expect(() => {
      validator.validate(validators);
    }).toThrow();
  });
});
