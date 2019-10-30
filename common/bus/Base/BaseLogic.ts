import * as _ from 'lodash';

import DbClient from '../../db/DbClient';
import { IDocument } from '../../interfaces';

class BaseLogic<T extends IDocument> {
  db: DbClient<T>;
  constructor(collection: string) {
    this.db = new DbClient<T>(collection);
  }
  //#region gets
  getOne = (list: Array<T>, id: string): T => {
    return _.find(list, (d: T) => {
      return d.id === id;
    });
  };
  getOnePredicate = (list: Array<T>, predicate: (item: T) => boolean): T => {
    return _.find(list, predicate);
  };
  getManyPredicate = (list: Array<T>, predicate: (item: T) => boolean): Array<T> => {
    return _.filter(list, predicate);
  };
  //#endregion
  //#region upserts
  upsertAsync = async (document: T): Promise<T> => {
    return await this.db.addUpdateAsync(document);
  };
  //#endregion

  //#region helpers
  //#endregion
}

export default BaseLogic;
