let CustomError = class CustomError extends Error {
    constructor(code = 460, ...params) {
      super(...params);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
  
      this.name = 'CustomError';
      this.code = code;
    }
  }

  module.exports = CustomError;