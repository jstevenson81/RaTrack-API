import * as _ from 'lodash';

import { getByUserName } from '../db/queries';
import { IResponse, IUser, IUserBusLogic } from '../interfaces';
import BaseLogic from './base/BaseLogic';
import UserValidator from './validation/modelValidators/userValidator';

class UserLogic extends BaseLogic<IUser> implements IUserBusLogic {
  constructor() {
    super('users');
  }

  predicates = {
    byUserName: (userName: string): ((user: IUser) => boolean) => {
      return (u: IUser) => {
        return u.userName === userName;
      };
    },
    byId: (id: string): ((user: IUser) => boolean) => {
      return (u: IUser) => {
        return u.id === id;
      };
    }
  };

  //#region adds/updates
  addNewAsync = async (user: IUser): Promise<IResponse> => {
    try {
      // validate the user account
      const validator = new UserValidator();
      const validationResp = validator.validate(user);
      if (!_.isEmpty(validationResp)) return this.validationError(validationResp);

      // look for a user account that already exists for this user
      const users: Array<IUser> = await this.db.queryAsync(
        getByUserName(user.userName),
        this.predicates.byUserName(user.userName)
      );
      // if we already have a user, throw
      if (!_.isEmpty(users))
        throw new Error(`A user with the name ${user.userName} already exists.`);
      // add the user
      const newUser = this.db.addUpdateAsync(user);
      // return the created user in an OK (200) response
      return this.created(newUser);
    } catch (err) {
      return this.serverError(err);
    }
  };

  updateAsync = async (user: IUser): Promise<IResponse> => {
    try {
      // validate the user account
      const validator = new UserValidator();
      const validationResp = validator.validate(user);
      if (!_.isEmpty(validationResp)) return this.validationError(validationResp);

      // get the user
      const dbUser = await this.db.getOneAsync(user.id);
      // if a user doesn't exist with this id, throw
      if (_.isUndefined(dbUser)) throw `A user with the id of ${user.id} was not found.`;

      // update the user's information
      dbUser.age = user.age;
      dbUser.firstName = user.firstName;
      dbUser.gender = user.gender;
      dbUser.lastName = user.lastName;
      dbUser.mobilePhone = user.mobilePhone;

      const upUser = this.db.addUpdateAsync(user);
      return this.ok(upUser);
    } catch (err) {
      return this.notFound(err);
    }
  };
  //#endregion

  //#region gets
  getUserAsync = async (userName: string): Promise<IResponse> => {
    try {
      if (_.isUndefined(userName) || userName === '')
        throw new Error('You must pass a user name to get a user account.');
      const users = await this.db.queryAsync(getByUserName(userName), (u: IUser) => {
        return u.userName === userName;
      });
      if (_.isEmpty(users)) throw new Error(`A user with the user name ${userName} was not found.`);
      else return this.ok(this.first(users));
    } catch (err) {
      return this.notFound(err);
    }
  };
  //#endregion
}

export default UserLogic;
