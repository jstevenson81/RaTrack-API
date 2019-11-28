import { IDocument, IValidationResponse } from '..';

export interface IModelValidator {
  validate(model: IDocument): Array<IValidationResponse>;
}
