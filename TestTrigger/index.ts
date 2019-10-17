import { Context, HttpRequest } from '@azure/functions';
import auth from '../common/auth';
import auth0Options from '../common/auth/auth0Options';
import { IResponse } from '../common/interfaces';

// create the main operation
const operation = (name: string, query: any): IResponse => {
  //  const name = req.query.name || (req.body && req.body.name);
  if (name) {
    return {
      status: 200 /* Defaults to 200 */,
      body: `Hello ${name} you are pretty coolio.  This is the body: ${JSON.stringify(query)}`
    };
  } else {
    return {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    };
  }
};

// get a reference to the auth module
const auth0 = auth(auth0Options);
// main trigger
const httpTrigger = auth0(
  async (context: Context, req: HttpRequest): Promise<void> => {
    const name = req.query.name || req.body.name;
    context.res = operation(name, req.query);
    context.done();
  }
);

export default httpTrigger;
