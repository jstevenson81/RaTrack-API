import { Container, CosmosClient, FeedResponse } from '@azure/cosmos';
import { SqlQuerySpec } from 'documentdb';
import * as _ from 'lodash';

import { ICosmosClient, ICosmosContainer, ICosmosDbConfig, IDocument } from '../interfaces';
import cosmosDbConfig from './config';
import { modelFactory } from './modelFactory';
import { getAll } from './queries';

/** This class allows a user to query a document database.  It is generic.  The type
 *  returned implements the IDocument interface which should have an id property.
 * @property {string} container This is the container for this instance of the database client. It is found in the constructor based on the
 * list of available containers from the config
 * @property {CosmosClient} client This is the actual CosmosDb Azure client object.
 * @property {ICosmosDbConfig} config This is the database config derived from the cosmosDbConfig import
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
        `The container passed (${container}) was not found in the config. Please add it to the config file if it exists.`
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
  getOneAsync = async (id: string, docType: string): Promise<T> => {
    // create the query spec
    const querySpec: SqlQuerySpec = {
      query: 'select * from root r where r.id = @id and r.docType = @docType',
      parameters: [
        { name: '@id', value: id },
        { name: '@docType', value: docType }
      ]
    };
    // run a query against the document db
    // get the feed and return the item or undefined
    var feed = await this.getFeedAsync(querySpec);
    const items = this.filterItems(feed, (i: T): boolean => {
      return i.id === id;
    });
    return _.isEmpty(items) ? undefined : _.head(items);
  };

  getAllAsync = async (docType: string): Promise<T[]> => {
    modelFactory().validateDocType(docType);
    // get the feed
    var feed = await this.getFeedAsync(getAll(docType));
    // map the feed to an array
    return this.mapFeedToList(feed);
  };

  queryAsync = async (
    sqlQuerySpec: SqlQuerySpec,
    predicate?: (item: T) => boolean
  ): Promise<Array<T>> => {
    // do we have a blank query spec?
    if (!sqlQuerySpec) throw new Error('The parameter sqlQuerySpec cannot be empty');
    // get the feed from the database
    const feed = await this.getFeedAsync(sqlQuerySpec);
    // if we are filtering, filter, otherwise map to an array
    return predicate ? this.filterItems(feed, predicate) : this.mapFeedToList(feed);
  };

  filterItems = (feed: FeedResponse<any>, predicate: (item: T) => boolean): Array<T> => {
    var list: Array<T> = this.mapFeedToList(feed);
    return _.filter(list, predicate);
  };
  //#endregion

  //#region CREATE UPDATE DELETE
  addUpdateAsync = async (document: T): Promise<T> => {
    let newDocument: T = Object.assign({}, modelFactory().update(document));
    await this.container.items.upsert(newDocument);
    return newDocument;
  };

  removeAsync = async (document: T): Promise<void> => {
    const foundDoc = this.container.item(document.id, document.guid);
    await foundDoc.delete();
  };
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

  //#endregion
}

export default DbClient;
