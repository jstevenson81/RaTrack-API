import { ICosmosContainer } from '..';

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