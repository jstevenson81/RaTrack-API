/**
 * This defines an error message that would be sent back via a function as the body in the event of an error.
 * @property {string} message The property containting the error message
 * @property {string} name The name of the error
 * @property {string?} stack This is the stack trace and is optional
 * @property {string} message If the error has a code associated with it, this is it.
 * @property {Array<IError>} inner This is the colletion of the inner exceptions
 *
 *
 */
export interface IError {
  message: string;
  name: string;
  stack?: string;
  code?: string;
  inner?: Array<IError>;
}