import { IActivity, IDocument, IFeeling } from '..';

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
  feelings: Array<IFeeling>;
  activities: Array<IActivity>;
}