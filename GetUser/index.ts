import { HttpRequest } from '@azure/functions';
import * as _ from 'lodash';
import { Context } from 'vm';

import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import DbClient from '../common/db/dbClient';
import { getByUserName } from '../common/db/queries';
import { IResponse, IUser } from '../common/interfaces';

// create the main operation
const operation = async (userName: string): Promise<IResponse> => {
  // setup the Dbclient
  const db = new DbClient<IUser>('users');
  // query the database for the user
  const users = await db.queryAsync(getByUserName(userName), (u: IUser) => {return u.userName === userName});
  return _.isEmpty(users)
    ? { status: 404, body: `The user with the name ${userName} was not found.` }
    : { status: 200, body: users[0] };
};

// get a reference to the auth module
const auth0 = auth(auth0Options);
// main trigger
const httpTrigger = auth0(
  async (context: Context, req: HttpRequest): Promise<void> => {
    context.res = await operation(req.params.userName);
    context.done();
  }
);

export default httpTrigger;
