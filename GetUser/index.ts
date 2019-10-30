// create the main operation
import { HttpRequest } from '@azure/functions';
import * as _ from 'lodash';
import { Context } from 'vm';

import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import DbClient from '../common/db/DbClient';
import { FilterByUserName } from '../common/db/predicates';
import { GetByUserName } from '../common/db/queries';
import { IResponse, IUser } from '../common/interfaces';

const operation = async (userName: string): Promise<IResponse> => {
  // setup the Dbclient
  const db = new DbClient<IUser>('users');
  // query the database for the user
  const users = await db.queryAsync(GetByUserName(userName), FilterByUserName(userName));
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
