
/*
Section:  Common Interfaces
Description:  This section holds the common interfaces used across the application
*/
export interface IError {
  message: string;
  name: string;
  stack?: string;
  code?: string;
  inner?: Array<IError>;
}

export interface IResponse {
  status: number;
  body: any;
}

/*
End Section: Common Interfaces
*/
/*
Section:  Auth Interfaces
Description:  This section holds interfaces specific to authorization and authentication
*/
export interface IAuth0Options {
  audience: string;
  issuer: string;
  algorithm: string;
}
