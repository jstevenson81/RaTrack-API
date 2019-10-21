import { ICosmosDbConfig, IError } from './index';
import { SqlQuerySpec } from 'documentdb';
import { SqlParameter } from '@azure/cosmos';

//#region Common Interfaces
/**
 * This defines an error message that would be sent back via a function as the body in the event of an error.
 * @property {string} message The property containting the error message
 * @property {string} name The name of the error
 * @property {string?} stack This is the stack trace and is optional
 * @property {string} message If the error has a code associated with it, this is it.
 * @property {Array<IError>} inner This is the colletion of the inner exceptions
 *
 *
 */
export interface IError {
  message: string;
  name: string;
  stack?: string;
  code?: string;
  inner?: Array<IError>;
}

export interface IResponse {
  status: number;
  body: any;
}

/**
 * This interface defines the config needed to create a cosmos db config object
 * @property {string} endPoint This the endpoint of the cosmos db we are trying to query
 * @property {string} key This is the primary access key for the database we're trying to query
 * @property {string} databaseId This is the name of the database (or id).
 * @property {Array<IComsmosContainer>} container The is the list of containers this database has access to query.
 */
export interface ICosmosDbConfig {
  endPoint: string;
  key: string;
  databaseId: string;
  containers: Array<ICosmosContainer>;
}

export interface ICosmosContainer {
  name: string;
}

/**
 * This interface defines the properties and methods required to be a cosmos client
 * @property {ICosmosDbConfig} config This is the config for connecting to the database
 */
export interface ICosmosClient<T extends IDocument> {
  /**
   * Gets one item from a collection based on the id of the item.
   * @param  {string} id This is the id of the item we are trying to find.
   * @returns {Promise<IDocument>}  This is the found item.
   */
  getOneAsync(id: string): Promise<T>;

  /**
   * Gets all items from a collection
   * @returns {Promise<Array<IDocument>>} A promise of items of type T.  T inherits from IDocument.
   */
  getAllAsync(): Promise<Array<T>>;

  /**
   * Gets an array of items based on the SQL statement passed
   * @param  {string} sql This is the SQL you want to execute against the document DB.
   * @param {Array<SqlParameter>} paramList this is the list of the parameters.
   * @returns {Promise<Array<IDocument>>} A promise of items of type T.  T inherits from IDocument.
   */
  queryAsync(sql: string, paramList: SqlParameter[]): Promise<Array<T>>;

  /**
   * Adds or updates a document.
   * @param  {T} document
   * @returns {Promise<T>} The newly added/updated item. T inherits from IDocument.
   */
  addUpdateAsync(document: T): Promise<T>;

  /**
   * Removes a document
   * @param  {T} document
   * @returns {Promise<void>}  Returns an empty promise.
   */
  removeAsync(document: T): Promise<void>;
}
//#endregion

//#region Authenticaion Interfaces
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
//#endregion
//# region Database Interfaces
/**
 * Defines what a base document should look like.  All documents have an id property.
 * @property {string} id This the identifier of the document.  Usually a GUID.
 */
export interface IDocument {
  id: string;
}
//#endregion
