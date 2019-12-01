import { HttpRequest } from '@azure/functions';
import { Context } from 'vm';

import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import FeelingLogic from '../common/bus/feelingLogic';

// get a reference to the auth module
const auth0 = auth(auth0Options);
// main trigger
const httpTrigger = auth0(
  async (context: Context, req: HttpRequest): Promise<void> => {
    let feelingLogic = new FeelingLogic();
    context.res = await feelingLogic.addFeelingAsync(req.body, req.params.userName);
    context.done();
  }
);

export default httpTrigger;
