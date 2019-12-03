import _ = require('lodash');

import DbClient from '../../db/dbClient';
import { IDocument, IError, IResponse, IUser, IValidationResponse } from '../../interfaces';

class BaseLogic<T extends IDocument> {
  db: DbClient<T>;
  constructor(collection: string) {
    this.db = new DbClient<T>(collection);
  }

  predicates = {
    byUserName: (userName: string): ((user: IUser) => boolean) => {
      return (u: IUser) => {
        return u.userName === userName;
      };
    },
    byId: (id: string): ((user: IUser) => boolean) => {
      return (u: IUser) => {
        return u.id === id;
      };
    }
  };

  first = (list: Array<T>): T => {
    return _.head(list);
  };

  //#region responses
  ok = (data: any) => this.goodResponse(data);
  created = (data: any) => this.goodResponse(data, 201);
  notFound = (err: Error) => this.badResponse(err, 404);
  serverError = (err: Error) => this.badResponse(err);
  validationError = (validationIssues: Array<IValidationResponse>) =>
    this.badResponse(
      new Error(
        'There was an error validating your request.  See the data property for the specific issues'
      ),
      400,
      validationIssues
    );
  //#endregion
  //#region response creators
  goodResponse = (data: any, status?: number): IResponse => {
    return {
      status: status | 200,
      body: { data: data }
    };
  };
  badResponse = (err: Error, status?: number, data?: any): IResponse => {
    return {
      status: status | 500,
      body: {
        err: this.createError(err),
        data: data
      }
    };
  };
  //#endregion
  //#region errors
  createError = (err: Error, inners?: Array<Error>): IError => {
    const created: IError = {
      message: err.message,
      name: err.name,
      stack: err.stack
    };

    created.inner = [];
    _.each(inners, (e: Error) => {
      created.inner.push({ message: e.message, name: e.name, stack: e.stack });
    });

    return created;
  };
  //#endregion
}

export default BaseLogic;
