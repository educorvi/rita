import PersistentRita, {DatabaseInterface, MySQL, Postgres, SQLite, DatabaseConfig} from "@educorvi/persistent-rita";
import {logger as globalLogger} from "../CustomLogger";
import Database, {ApiKey} from "../config/Database";

export const DEVELOPMENT = process.env.NODE_ENV !== 'production';

export const logger = globalLogger;

export let rita: PersistentRita;
export let configDB: Database;

function dbConnectionError(type: string) {
    return function (e: Error) {
        logger.fatal(`Failed to initialize ${type} database: ${e.message}`);
        process.exit(-1);
    }
}

const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_TYPE, DB_SQLITE_PATH} = process.env
/**
 * Options for database connection read from environment
 */
export const db_options: DatabaseConfig = {
    host: DB_HOST || undefined,
    port: Number.parseInt(DB_PORT) || undefined,
    username: DB_USERNAME || undefined,
    password: DB_PASSWORD || undefined,
    database: DB_DATABASE || undefined
}

/**
 * Function to initialize connection to persistent rita
 */
async function initRita() {

    logger.debug(db_options);

    let db: DatabaseInterface;
    try {
        switch (DB_TYPE) {
            case "MYSQL":
                db = await MySQL.getDB(db_options, logger);
                break;

            case "POSTGRES":
                db = await Postgres.getDB(db_options, logger);
                break;

            case "SQLITE":
                db = await SQLite.getDB(process.env.DB_SQLITE_PATH, logger);
                break;

            default:
                dbConnectionError("rita")(new Error("Unknown DB type: " + DB_TYPE));
                return;
        }
    } catch (e){
        dbConnectionError("rita")(e);
    }


    rita = new PersistentRita(db, logger)
}

/**
 * Function to initialize connection to config db
 */
async function initConfigDB() {
    const type = DB_TYPE.toLowerCase();
    if (!(type === "mysql" || type === "sqlite" || type === "postgres")) {
        dbConnectionError("config")(new Error("Unknown DB type: " + DB_TYPE));
        return;
    }
    if (type === "sqlite") {
        db_options.database = DB_SQLITE_PATH
    }
    try {
        // noinspection TypeScriptValidateTypes
        configDB = await Database.getDB({
            type,
            ...db_options
        });
    } catch (e){
        dbConnectionError("config")(e);
    }

    // Generate public Access key, if it does not exist
    let publicAccess = await configDB.getApiKey("*");
    if (!publicAccess) {
        logger.warn("No public API Key. Setting one with default permissions...")
        publicAccess = new ApiKey();
        publicAccess.name = "Public Access";
        publicAccess.api_key = "*";
        publicAccess.created = new Date();
        publicAccess.view = true;
        publicAccess.evaluate = true;
        publicAccess.manage = false;

        await configDB.setApiKey(publicAccess);
    }
    logger.log("Connection to Config Database established");
    if (publicAccess.manage) {
        logger.warn("Your management endpoint is public!");
    }
}

/**
 * Initialize both databases
 */
export async function init() {
    await initConfigDB();
    await initRita();
}

