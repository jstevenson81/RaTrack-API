import { IUser } from '../interfaces';

/**
 * This method returns a predicate function we can use to filter an array of items for a user
 * @param {string} userName The user's user name we are trying to filter by
 */
export const FilterByUserName = (userName: string): any => {
  return (u: IUser): boolean => {
    return u.userName === userName;
  };
};
