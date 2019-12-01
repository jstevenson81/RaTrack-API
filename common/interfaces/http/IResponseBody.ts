import { IError } from '..';

export interface IResponseBody {
  data: any;
  err?: IError;
}
