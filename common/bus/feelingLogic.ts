import * as _ from 'lodash';
import * as moment from 'moment';

import { getByUserName } from '../db/queries';
import { IFeeling, IFeelingBusLogic, IResponse, IUser } from '../interfaces';
import BaseLogic from './base/BaseLogic';

class FeelingLogic extends BaseLogic<IUser> implements IFeelingBusLogic {
  constructor() {
    super('users');
  }

  //#region priaate methods
  private findUserByNameAsync = async (userName: string): IUser => {
    const users = await this.db.queryAsync(
      getByUserName(userName),
      this.predicates.byUserName(userName)
    );
    if (_.isEmpty(users) || _.isUndefined(users))
      throw new Error(`A user with the user name ${userName} was not found.`);
    return this.first(users);
  };
  //#endregion

  deleteFeelingAsync = async (feeling: IFeeling, userName: string): Promise<IResponse> => {

    let user: IUser;

    try {
      user = await this.findUserByNameAsync(userName);
    } catch (e) {
      return this.notFound(e);
    }
    try {
      
    } catch (e) {}
  };

  addFeelingAsync = async (feeling: IFeeling, userName: string): Promise<IResponse> => {
    let user: IUser;
    let users: Array<IUser>;
    try {
      user = await this.findUserByNameAsync(userName);
    } catch (e) {
      return this.notFound(e);
    }
    try {
      user = this.first(users);

      if (_.isUndefined(user.feelings)) user.feelings = [];
      let dbFeeling = this.db.paritionDocument<IFeeling>(feeling);
      dbFeeling.timeOfDay = moment(feeling.timeOfDay).toDate();

      user.feelings.push(dbFeeling);
      let updatedUser = await this.db.addUpdateAsync(user);
      return this.ok(updatedUser);
    } catch (e) {
      return this.serverError(e);
    }
  };
}

export default FeelingLogic;
