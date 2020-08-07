export enum ErrorType {
   UNKNOWN = 'UNKNOWN',
   FILEEXISTS = 'FILEEXISTS'
}

export class DataPluginError extends Error {
   public errorType : ErrorType = ErrorType.UNKNOWN;
   constructor(errorType: ErrorType, message: string) {
      super(message);
      this.errorType = errorType;
      Object.setPrototypeOf(this, DataPluginError.prototype);
   }
}

export class FileExistsError extends DataPluginError {
   constructor(message: string) {
      super(ErrorType.FILEEXISTS, message);
      Object.setPrototypeOf(this, FileExistsError.prototype);
   }
}
