/**
 * This interface defines a validation response
 * @property {string} field This is the field we're validating
 * @property {string} message This is the message from the validator.
 * @property {boolean} valid This tells you if the field is valid or not.
 */
export interface IValidationResponse {
  field: string;
  message: string;
  valid: boolean;
}