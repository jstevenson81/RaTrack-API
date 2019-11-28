import { IDocument, IFeeling } from '.';

/**
 * This describes an activity
 */
export interface IActivity extends IDocument {
  activity: string;
  total: number;
  unitOfMeasure: string;
  feelings?: Array<IFeeling>;
}