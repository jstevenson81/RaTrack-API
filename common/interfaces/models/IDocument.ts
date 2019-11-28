/**
 * This is a simple representation of the document so we can
 * pass DTO's back and forth via the API
 */
export interface IDocument {
  id: string;
  createDate?: string;
  createTime?: string;
  updateTime?: Date;
}

