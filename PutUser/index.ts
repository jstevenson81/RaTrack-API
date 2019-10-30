// create the main operation
import { HttpRequest } from '@azure/functions';
import _ = require('lodash');
import { Context } from 'vm';

import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import DbClient from '../common/db/DbClient';
import { FilterByUserName } from '../common/db/predicates';
import { GetByUserName } from '../common/db/queries';
import { IResponse, IUser } from '../common/interfaces';

const operation = async (user: IUser): Promise<IResponse> => {
  // setup the Dbclient
  const db = new DbClient<IUser>('users');
  // first we need to see if a user exists
  var eUsers = await db.queryAsync(GetByUserName(user.userName), FilterByUserName(user.userName));

  // do we already have a user with that user name?  Okay, update him/her
  if (_.isEmpty(eUsers) === false) {
    var eUser = eUsers[0];
    eUser.age = user.age;
    eUser.firstName = user.firstName;
    eUser.lastName = user.lastName;
    eUser.mobilePhone = user.mobilePhone;

    var uUser = await db.addUpdateAsync(eUser);
    return {
      status: 200,
      body: {
        message: `Updated the user ${user.userName}.`,
        user: uUser
      }
    };
  }
  return {
    status: 404,
    body: { message: `There was no user found with the user name ${user.userName}` }
  };
};

// get a reference to the auth module
const auth0 = auth(auth0Options);
// main trigger
const httpTrigger = auth0(
  async (context: Context, req: HttpRequest): Promise<void> => {
    context.res = await operation(req.body);
    context.done();
  }
);

export default httpTrigger;
