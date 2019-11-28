import { IDocument } from '..';

/**
 * This describes a feeling
 */
export interface IFeeling extends IDocument {
  timeOfDay: string;
  feeling: string;
  bodyArea: string;
}