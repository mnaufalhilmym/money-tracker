export default class Log {
  static log(message?: any, ...optionalParams: any[]) {
    console.log(new Date(), "[LOG]", message, ...optionalParams);
  }

  static info(message?: any, ...optionalParams: any[]) {
    console.info(new Date(), "[INFO]", message, ...optionalParams);
  }

  static error(message?: any, ...optionalParams: any[]) {
    console.error(new Date(), "[ERROR]", message, ...optionalParams);
  }
}
