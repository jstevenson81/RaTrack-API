import { FeedResponse, SqlQuerySpec } from '@azure/cosmos';

import { IDocument } from '..';

/**
 * This interface defines the properties and methods required to be a cosmos client
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
   * @param {SqlQuerySpec} sqlQuerySpec This is the query + params.
   * @returns {Promise<Array<IDocument>>} A promise of items of type T.  T inherits from IDocument.
   */
  queryAsync(
    sqlQuerySpec: SqlQuerySpec,
    predicate?: (item: T) => boolean
  ): Promise<Array<T>>;

  /**
   * Gets one item from a feed based on a predicate method
   * @param {FeedResponse<any>} feed This is the feed from the document db query that contains the items
   * @param {Function} predicate This is the method that will be run across each item as we try to find the item in the feed.
   * @returns {T} The item or if not found, undefined.
   */
  filterItems(
    feed: FeedResponse<any>,
    predicate: (item: T) => boolean
  ): Array<T>;

  /**
   * Adds or updates a document.
   * @param  {T} document
   * @returns {Promise<T>} The newly added/updated item. T inherits from IDocument.
   */
  addUpdateAsync(document: T): Promise<T>;

  /**
   * This method creates the create date and create time properties on an item
   * @param {T} document This is the document you want to add a create date and create time.
   * @returns {T} Returns the newly populated document
   */
  paritionDocument(document: T): T;

  /**
   * Removes a document
   * @param  {T} document
   * @returns {Promise<void>}  Returns an empty promise.
   */
  removeAsync(document: T): Promise<void>;
}
