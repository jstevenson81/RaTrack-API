import { IDocument } from '..';

/**
 * The represents a user in the document db
 */
export interface IUser extends IDocument {
  userName: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  mobilePhone: string;
}
