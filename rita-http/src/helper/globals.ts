import PersistentRita, {
    DatabaseInterface,
    MySQL,
    Postgres,
    SQLite,
    DatabaseConfig,
} from '@educorvi/persistent-rita';
import { logger as globalLogger } from '../CustomLogger';
import Database, { ApiKey, supportedDBTypes } from '../config/Database';
import { PluginClass } from '@educorvi/rita';
import HTTP_Plugin from '@educorvi/rita-plugin-http';

export const DEVELOPMENT = process.env.NODE_ENV !== 'production';

export const logger = globalLogger;

export let rita: PersistentRita;
export let configDB: Database;
export const plugins: Array<PluginClass> = [HTTP_Plugin];

function dbConnectionError(type: string) {
    return function (e: Error) {
        logger.fatal(`Failed to initialize ${type} database: ${e.message}`);
        process.exit(-1);
    };
}

const {
    PORT,
    LOGLEVEL,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_TYPE,
    DB_SQLITE_PATH,
} = process.env;

const type = DB_TYPE?.toLowerCase();
/**
 * Options for database connection read from the environment
 */
export const db_options: DatabaseConfig = {
    host: DB_HOST || undefined,
    port: Number.parseInt(DB_PORT) || undefined,
    username: DB_USERNAME || undefined,
    password: DB_PASSWORD || undefined,
    database: DB_DATABASE || undefined,
};

/**
 * Function to initialize connection to persistent rita
 */
async function initRita() {
    logger.debug(db_options);

    let db: DatabaseInterface;
    try {
        switch (DB_TYPE) {
            case 'MYSQL':
                db = await MySQL.getDB(db_options, logger);
                break;

            case 'POSTGRES':
                db = await Postgres.getDB(db_options, logger);
                break;

            case 'SQLITE':
                db = await SQLite.getDB(process.env.DB_SQLITE_PATH, logger);
                break;

            default:
                dbConnectionError('rita')(
                    new Error('Unknown DB type: ' + DB_TYPE)
                );
                return;
        }
    } catch (e) {
        dbConnectionError('rita')(e);
    }

    rita = new PersistentRita(db, logger);
}

function checkDBType(type: string): asserts type is supportedDBTypes {
    if (!(type === 'mysql' || type === 'sqlite' || type === 'postgres')) {
        dbConnectionError('config')(
            new Error('Unknown DB type: ' + type.toUpperCase())
        );
    }
}

/**
 * Function to initialize connection to config db
 */
async function initConfigDB() {
    if (type === 'sqlite') {
        db_options.database = DB_SQLITE_PATH;
    }
    checkDBType(type);
    try {
        // noinspection TypeScriptValidateTypes
        configDB = await Database.getDB({
            type,
            ...db_options,
        });
    } catch (e) {
        dbConnectionError('config')(e);
    }

    // Generate public Access key, if it does not exist
    let publicAccess = await configDB.getApiKey('*');
    if (!publicAccess) {
        logger.warn(
            'No public API Key. Setting one with default permissions...'
        );
        publicAccess = new ApiKey();
        publicAccess.name = 'Public Access';
        publicAccess.api_key = '*';
        publicAccess.created = new Date();
        publicAccess.view = true;
        publicAccess.evaluate = true;
        publicAccess.manage = false;

        await configDB.setApiKey(publicAccess);
    }
    logger.log('Connection to Config Database established');
    if (publicAccess.manage) {
        logger.warn('Your management endpoint is public!');
    }
}

function fatalConfigError(message: string) {
    logger.fatal(message);
    process.exit(-2);
}

function checkEnvironmentVariables() {
    if (!PORT) logger.warn('No port in .env specified. Defaulting to 3000');
    if (!LOGLEVEL)
        logger.warn('No log level in .env specified. Defaulting to "info"');
    if (!DB_TYPE) fatalConfigError('No database type in .env specified');

    if (DB_TYPE === 'SQLITE' && !DB_SQLITE_PATH)
        fatalConfigError('No path for SQLite DB in .env specified');
    if (DB_TYPE === 'MYSQL' || DB_TYPE === 'POSTGRES') {
        if (!DB_HOST) fatalConfigError('No database host in .env specified');
        if (!DB_PORT) fatalConfigError('No database port in .env specified');
        if (!DB_USERNAME)
            fatalConfigError('No database username in .env specified');
        if (!DB_PASSWORD)
            fatalConfigError('No database password in .env specified');
        if (!DB_DATABASE) fatalConfigError('No database in .env specified');
    }
}

/**
 * Initialize both databases
 */
export async function init() {
    checkEnvironmentVariables();
    await initConfigDB();
    await initRita();
}
