import { Context, HttpRequest } from '@azure/functions';
import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import { IResponse } from '../common/interfaces';
import * as _ from 'lodash';

// create the main operation
const operation = (userId: number): IResponse => {
  // return a set of users
  const users = [];
  for (var i = 1; i < 51; i++) {
    const age = Math.floor(Math.random() * 100 + 30);
    users.push({
      userId: i,
      userName: `jsteve81-${i}`,
      firstName: `jonathan-${i}`,
      lastName: `stevenson-${i}`,
      age: age
    });
  }
  if (isNaN(userId) == false) {
    var user = _.find(users, (u, i) => {
      return u.userId === userId;
    });
    return {
      status: 200,
      body: user
    };
  }
  return {
    status: 200,
    body: users
  };
};

// get a reference to the auth module
const auth0 = auth(auth0Options);
// main trigger
const httpTrigger = auth0(
  async (context: Context, req: HttpRequest): Promise<void> => {
    const userId = Number(req.params.userId);
    context.res = operation(userId);
    context.done();
  }
);

export default httpTrigger;
