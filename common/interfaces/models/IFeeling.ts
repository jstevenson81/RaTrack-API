import { IDocument } from '..';

/**
 * This describes a feeling
 */
export interface IFeeling extends IDocument {
  userId: string;
  timeOfDay: Date;
  feeling: string;
  bodyArea: string;
}
