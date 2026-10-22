export class Logger {
  static debug(message: string, ...args: any[]): void {
    if (process.env.DEBUG_ANYTHINGDOWN) {
      console.log(`[AnythingDown:DEBUG] ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    console.log(`[AnythingDown:INFO] ${message}`, ...args);
  }

  static warn(message: string, ...args: any[]): void {
    console.warn(`[AnythingDown:WARN] ${message}`, ...args);
  }

  static error(message: string, ...args: any[]): void {
    console.error(`[AnythingDown:ERROR] ${message}`, ...args);
  }
}
