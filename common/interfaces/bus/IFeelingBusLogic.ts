import { IFeeling, IResponse } from '../';

export interface IFeelingBusLogic {
  /**
   * Adds a new feeling to the database
   * @param {IFeeling} feeling this is the feeling added to the user's record
   */
  addFeelingAsync(feeling: IFeeling, userName: string): Promise<IResponse>;

  /**
   * Removes a feeling from a user's record
   * @param {string} feelingId The feeling we want to remove
   * @param {string} userName This is the user name of the user we are trying to find
   */
  deleteFeelingAsync(feelingId: string, userName: string): Promise<IResponse>;
}
