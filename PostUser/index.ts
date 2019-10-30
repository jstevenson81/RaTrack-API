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
  if (_.isEmpty(eUsers) === false) {
    return {
      status: 200,
      body: { message: `User with the user name ${user.userName} already exists.`, user: eUsers[0] }
    };
  }
  // query the database for the user
  var newUser = await db.addUpdateAsync(user);
  return { status: 200, body: newUser };
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
