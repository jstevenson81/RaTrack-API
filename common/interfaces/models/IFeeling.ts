import { IDocument } from '..';

/**
 * This describes a feeling
 */
export interface IFeeling extends IDocument {
  timeOfDay: Date;
  feeling: string;
  bodyArea: string;
}