import { HttpRequest } from '@azure/functions';
import { Context } from 'vm';

import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import UserLogic from '../common/bus/userLogic';

// get a reference to the auth module
const auth0 = auth(auth0Options);
// main trigger
const httpTrigger = auth0(
  async (context: Context, req: HttpRequest): Promise<void> => {
    let logic = new UserLogic();
    context.res = await logic.addNewAsync(req.body);
    context.done();
  }
);

export default httpTrigger;
