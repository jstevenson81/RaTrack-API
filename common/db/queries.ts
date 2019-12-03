import { SqlQuerySpec } from 'documentdb';

import { docTypes, modelFactory } from './modelFactory';

/**
 * This method returns a SqlQuerySpec to get a user by their user name
 * @param {string} userName This is the user's user name
 */
export const getByUserName = (userName: string): SqlQuerySpec => {
  return {
    query: `select * from root r where r.userName = @userName and r.docType = ${docTypes.user}`,
    parameters: [{ name: '@userName', value: userName }]
  };
};

/**
 * This method returns a SqlQuerySpec that gets all items from a collection
 */
export const getAll = (docType: string): SqlQuerySpec => {
  modelFactory().validateDocType(docType);
  return {
    query: 'select * from root r where r.docType = @docType',
    parameters: [{ name: '@docType', value: docType }]
  };
};
