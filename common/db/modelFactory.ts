import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';

import { IDocument } from '../interfaces';

export const docTypes = { user: 'user', feeling: 'feeling', activity: 'activity' };

export const modelFactory = () => {
  const validateDocType = (docType: string) => {
    let match: boolean = false;

    _.forOwn(docTypes, (val: string, key: string) => {
      if (val === docType) {
        match = true;
        return false;
      }
    });
    if (!match) {
      throw new Error(
        `The docType ${docType} is not valid. You must use one of the following ${JSON.stringify(
          docTypes
        )}.`
      );
    }
  };

  const create = (docType: string): IDocument => {
    validateDocType(docType);

    const newDocument: IDocument = {
      id: uuid(),
      guid: uuid(),
      docType: docType,
      createTime: moment().toDate(),
      updateTime: moment().toDate()
    };

    return newDocument;
  };

  const update = <T extends IDocument>(document: T): T => {
    let newDocument = Object.assign({}, document);
    newDocument.updateTime = moment().toDate();
    return newDocument;
  };

  return {
    validateDocType: validateDocType,
    create: create,
    update: update
  };
};
