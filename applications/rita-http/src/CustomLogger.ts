import { ILogObj, ISettingsParam, Logger } from 'tslog';
import { PersistentRitaLogger } from '@educorvi/persistent-rita';

/**
 * Logger class
 */
export default class CustomLogger extends PersistentRitaLogger {
    private logger: Logger<ILogObj>;
    private enabled: boolean = true;
    constructor(settings?: ISettingsParam<ILogObj>) {
        super();
        this.logger = new Logger(settings);
    }

    enable(b: boolean): void {
        this.enabled = b;
    }

    fatal(data: any): void {
        if (!this.enabled) return;
        this.logger.fatal(data);
    }

    error(data: any): void {
        if (!this.enabled) return;
        this.logger.error(data);
    }

    log(data: any): void {
        if (!this.enabled) return;
        this.logger.info(data);
    }

    debug(data: any): void {
        if (!this.enabled) return;
        this.logger.debug(data);
    }

    warn(data: any): void {
        if (!this.enabled) return;
        this.logger.warn(data);
    }
}

function getLogLevel() {
    const logLevelString = process.env.LOGLEVEL || 'info';
    switch (logLevelString) {
        case 'silly':
            return 0;
        case 'trace':
            return 1;
        case 'debug':
            return 2;
        case 'info':
            return 3;
        case 'warn':
            return 4;
        case 'error':
            return 5;
        case 'fatal':
            return 6;
    }
}

/**
 * Logger for use in the application
 */
export const logger = new CustomLogger({
    minLevel: getLogLevel(),
    hideLogPositionForProduction: true,
});
