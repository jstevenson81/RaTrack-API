import _ = require('lodash');

import DbClient from '../../db/dbClient';
import { IDocument } from '../../interfaces';
import { IError } from '../../interfaces/http/IError';
import { IResponse } from '../../interfaces/http/IResponse';

class BaseLogic<T extends IDocument> {
  db: DbClient<T>;
  constructor(collection: string) {
    this.db = new DbClient<T>(collection);
  }

  head = (list: Array<T>): T => {
    return _.head(list);
  };

  ok = (data: any) => this.goodResponse(data);
  created = (data: any) => this.goodResponse(data, 201);
  notFound = (err: Error) => this.badResponse(err, 404);
  serverError = (err: Error) => this.badResponse(err);

  goodResponse = (data: any, status?: number): IResponse => {
    return {
      status: status | 200,
      body: { data: data }
    };
  };
  badResponse = (err: Error, status?: number): IResponse => {
    return {
      status: status | 500,
      body: {
        err: this.createError(err),
        data: undefined
      }
    };
  };
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
}

export default BaseLogic;
