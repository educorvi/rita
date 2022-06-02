import {ISettingsParam, Logger} from "tslog";
import {PersistentRitaLogger} from "@educorvi/persistent-rita"

/**
 * Logger class
 */
export default class CustomLogger extends PersistentRitaLogger{
    private logger: Logger;
    private enabled: boolean = true;
    constructor(settings?: ISettingsParam) {
        super();
        this.logger = new Logger(settings);
    }

    enable(b: boolean): void {
        this.enabled = b;
    }

    fatal(data: any): void {
        if(!this.enabled) return;
        this.logger.fatal(data);
    }

    error(data: any): void {
        if(!this.enabled) return;
        this.logger.error(data);
    }

    log(data: any): void {
        if(!this.enabled) return;
        this.logger.info(data);
    }

    debug(data: any): void {
        if(!this.enabled) return;
        this.logger.debug(data);
    }

    warn(data: any): void {
        if(!this.enabled) return;
        this.logger.warn(data);
    }
};

/**
 * Logger for use in the application
 */
export const logger = new CustomLogger({
    displayFilePath: "hidden",
    displayFunctionName: false,
    dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // @ts-ignore
    minLevel: process.env.LOGLEVEL || "info"
});
