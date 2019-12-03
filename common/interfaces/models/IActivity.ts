import { IDocument } from '..';

/**
 * This describes an activity
 */
export interface IActivity extends IDocument {
  feelingId: string;
  activity: string;
  total: number;
  unitOfMeasure: string;
}
