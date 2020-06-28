export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    //just for logging in the server logs we send a message to the main built class
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
