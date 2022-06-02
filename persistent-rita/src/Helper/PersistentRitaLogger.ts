import { Logger as tLogger, QueryRunner } from 'typeorm';
import {
    DefaultConsoleLogger as RitaDefaultLogger,
    Logger as rLogger,
} from '@educorvi/rita';

/**
 * A logger for Persistant Rita
 */
export abstract class PersistentRitaLogger implements rLogger {
    abstract debug(data: any): void;

    abstract error(data: any): void;

    abstract fatal(data: any): void;

    abstract log(data: any): void;

    abstract warn(data: any): void;

    getTypeORMLogger(): tLogger {
        const that = this;
        return new (class implements tLogger {
            // @ts-ignore
            log(level: 'log' | 'info' | 'warn', message: any): any {
                switch (level) {
                    case 'log':
                        that.debug(message);
                        break;
                    case 'info':
                        that.log(message);
                        break;
                    case 'warn':
                        that.warn(message);
                        break;
                }
            }

            // @ts-ignore
            logMigration(message: string, queryRunner?: QueryRunner): any {
                that.debug(message);
            }

            // @ts-ignore
            logQuery(query: string): any {
                that.debug('Query: ' + query);
            }

            // @ts-ignore
            logQueryError(error: string | Error): any {
                that.error(error);
            }

            // @ts-ignore
            logQuerySlow(time: number, query: string): any {
                that.warn(
                    "Slow query: '" + query + "' took " + time + ' seconds'
                );
            }

            // @ts-ignore
            logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
                that.debug(message);
            }
        })();
    }
}

/**
 * A default logger implementation using the console logger.
 */
export class DefaultConsoleLogger extends PersistentRitaLogger {
    private logger = new RitaDefaultLogger();

    debug = this.logger.debug;
    log = this.logger.log;
    warn = this.logger.warn;
    error = this.logger.error;
    fatal = this.logger.fatal;
}
