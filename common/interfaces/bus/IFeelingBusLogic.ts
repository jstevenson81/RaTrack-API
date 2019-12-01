import { IFeeling, IResponse } from '../';

export interface IFeelingBusLogic {
  /**
   * Adds a new feeling to the database
   * @param {IFeeling} feeling this is the feeling added to the user's record
   */
  addFeelingAsync(feeling: IFeeling, userName: string): Promise<IResponse>;
}
