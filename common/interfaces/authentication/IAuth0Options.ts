/**
 * Defines the authentication options Auth0 requires for validating a token
 * @property {string} audience This is the api identifier. Typically a url.
 * @property {string} issuer This is the url of the auth0 tenant.
 * @property {string} algorithm This is either RS256 or HS256. New applications in auth0 always use RS256.
 */
export interface IAuth0Options {
  audience: string;
  issuer: string;
  algorithm: string;
}