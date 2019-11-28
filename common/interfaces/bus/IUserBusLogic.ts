import { IResponse, IUser } from '..';

/**
 * This interface defines business logic for a user account
 */
export interface IUserBusLogic {
  /**
   * Adds a new user if they do not already exist as a user
   * @param {IUser} user This is the user we are trying to add
   */
  addNewAsync(user: IUser): Promise<IResponse>;

  /**
   * Updates a user
   * @param {IUser} user This is the user we're trying to update
   */
  updateAsync(user: IUser): Promise<IResponse>;
  /**
   * This methods gets a user based on their user name
   * @param {string} userName The user's user name we're using the file them
   */
  getUserAsync(userName: string): Promise<IResponse>;
}
