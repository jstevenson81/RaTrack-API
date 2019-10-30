import * as _ from 'lodash';

import { FilterByUserName } from '../db/predicates';
import { GetByUserName } from '../db/queries';
import { IUser, IUserBusLogic } from '../interfaces';
import BaseLogic from './Base/BaseLogic';

class UserLogic extends BaseLogic<IUser> implements IUserBusLogic {
  constructor() {
    super('users');
  }

  getUserAsync = async (userName: string): Promise<IUser> => {
    const users = await this.db.queryAsync(GetByUserName(userName), FilterByUserName(userName));
    return _.isUndefined(users) ? undefined : users[0];
  };
  upsertUserAsync = async (user: IUser): Promise<IUser> => {
    return await this.upsertAsync(user);
  };
}

export default UserLogic;
