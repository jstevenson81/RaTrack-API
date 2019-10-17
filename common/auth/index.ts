import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import { Context, AzureFunction, HttpRequest } from '@azure/functions';
import { IError, IAuth0Options } from '../interfaces';

const auth = (options: IAuth0Options) => {
  // Authentication middleware. When used, the
  // Access Token must exist and be verified against
  // the Auth0 JSON Web Key Set
  let checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${options.issuer}.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: options.audience,
    issuer: options.issuer,
    algorithms: [options.algorithm]
  });

  return (next: AzureFunction): AzureFunction => {
    return (context: Context, req: HttpRequest): void => {
      checkJwt(context.req as any, null, authError => {
        if (authError) {
          var error: IError = {
            name: authError.name,
            message: authError.message,
            code: authError.code,
            inner: [
              {
                name: authError.inner.name,
                message: authError.inner.message
              }
            ]
          };
          context.res = { status: authError.status, body: error };
          return context.done();
        }
        return next(context, req);
      });
    };
  };
};

export default auth;
