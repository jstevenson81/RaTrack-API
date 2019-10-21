// component imports
import { Container, CosmosClient, FeedResponse } from '@azure/cosmos';
import { SqlParameter, SqlQuerySpec } from 'documentdb';
import * as _ from 'lodash';

import { ICosmosClient, ICosmosContainer, ICosmosDbConfig, IDocument } from '../interfaces';
import cosmosDbConfig from './config';

// app imports
/** This class allows a user to query a document database.  It is generic.  The type
 *  returned implements the IDocument interface which should have an id property.
 * @property {string} container This is the container for this instance of the database client. It is found in the constructor based on the
 * list of available containers from the config
 * @property {CosmosClient} client This is the actual CosmosDb Azure client object.
 * @property {ICosmosDbConfig} config This is the database config derived from the cosmosDbConfig import
 *
 */
class DbClient<T extends IDocument> implements ICosmosClient<T> {
  //#region members properties
  config: ICosmosDbConfig;
  container: Container;
  client: CosmosClient;

  //#endregion

  //#region ctor
  /**
   * Create an RaTrackClient to query a cosmos db
   * @param  {string} container:  This is the container of the collection we're trying to query
   */
  constructor(container: string) {
    this.config = Object.assign({}, cosmosDbConfig);
    // find the container in the config
    const foundContainer = _.find(this.config.containers, (c: ICosmosContainer, i: number) => {
      return c.name == container;
    });
    // we didn't find the container, so we need to throw
    if (_.isUndefined(foundContainer))
      throw new Error(
        `The container passed: ${container} to the constructor was not found in the config.`
      );

    // create the client
    this.client = new CosmosClient({
      endpoint: this.config.endPoint,
      key: this.config.key
    });
    // set the container name of the container to be used in this instance
    this.container = this.client.database(this.config.databaseId).container(foundContainer.name);
  }
  //#endregion

  //#region READ
  getOneAsync = async (id: string): Promise<T> => {
    // create the query spec
    const querySpec: SqlQuerySpec = {
      query: 'select * from root r where r.id = @id',
      parameters: [{ name: '@id', value: id }]
    };
    // run a query against the document db
    // get the feed and return the item or undefined
    var feed = await this.getFeedAsync(querySpec);
    return this.getOneItem(feed, (item: T) => {
      return item.id === id;
    });
  };

  getAllAsync = async (): Promise<T[]> => {
    // run the query to get all items
    const spec: SqlQuerySpec = {
      query: 'select * from root',
      parameters: []
    };
    // get the feed
    var feed = await this.getFeedAsync(spec);
    // map the feed to an array
    return this.mapFeedToList(feed);
  };

  queryAsync = async (sql: string, paramList: Array<SqlParameter>): Promise<Array<T>> => {
    if (_.isEmpty(sql)) throw new Error('The parameter sql cannot be empty');
    const querySpec: SqlQuerySpec = { query: sql, parameters: paramList };
    const feed = await this.getFeedAsync(querySpec);
    return this.mapFeedToList(feed);
  };
  //#endregion

  //#region CREATE UPDATE DELETE
  addUpdateAsync(document: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  removeAsync(document: T): Promise<void> {
    throw new Error('Method not implemented.');
  }
  //#endregion

  //#region private methods
  /**
   * This method runs a query against the database and gets back a feed response
   * @param {SqlQuerySpec} spec This is the specification of the query including the params.
   * @returns {Promise<FeedResponse<any>>} Returns a feed response from the database.  This is used to iterate through items.
   */
  private getFeedAsync = async (spec: SqlQuerySpec): Promise<FeedResponse<any>> => {
    return await this.container.items.query(spec).fetchAll();
  };

  /**
   * This method maps a feed to an array of items
   * @param {FeedResponse<any>} feed This is the feed from the document db query that contains the items
   * @returns {Array<T>} an array of items mapped from the feed
   */
  private mapFeedToList = (feed: FeedResponse<any>): Array<T> => {
    var results = feed.resources;
    return _.map(results, _.clone);
  };

  /**
   * Gets one item from a feed based on a predicate method
   * @param {FeedResponse<any>} feed This is the feed from the document db query that contains the items
   * @param {Function} predicate This is the method that will be run across each item as we try to find the item in the feed.
   * @returns {T} The item or if not found, undefined.
   */
  private getOneItem = (feed: FeedResponse<any>, predicate: (item: T) => boolean): T => {
    var list: Array<T> = this.mapFeedToList(feed);
    return _.find(list, predicate);
  };

  //#endregion
}

export default DbClient;
