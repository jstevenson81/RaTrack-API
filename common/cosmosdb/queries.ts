import { SqlQuerySpec } from 'documentdb';

/**
 * This method returns a SqlQuerySpec to get a user by their user name
 * @param {string} userName This is the user's user name
 */
export const GetByUserName = (userName: string): SqlQuerySpec => {
  return {
    query: 'select * from root r where r.userName = @userName',
    parameters: [{ name: '@userName', value: userName }]
  };
};

/**
 * This method returns a SqlQuerySpec that gets all items from a collection
 */
export const GetAll = (): SqlQuerySpec => {
  return { query: 'select * from root r', parameters: [] };
};
