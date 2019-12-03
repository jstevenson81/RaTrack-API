/**
 * This is a simple representation of the document so we can
 * pass DTO's back and forth via the API
 */
export interface IDocument {
  id: string;
  guid: string;
  docType: string;
  createTime: Date;
  updateTime: Date;
}
