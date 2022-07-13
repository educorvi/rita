import { Column, DataSource, Entity, PrimaryColumn, Repository } from 'typeorm';
import { DatabaseConnectionClosedError } from '@educorvi/persistent-rita';
import crypto from 'crypto';
import { logger } from '../CustomLogger';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export type supportedDBTypes = 'mysql' | 'sqlite' | 'postgres';

/**
 * DB Adapter for storage of API Keys and boolean settings
 * Uses singleton pattern
 * @category Database Adapters
 */
export default class Database {
    /** The database instance (singleton pattern) */
    protected static db: Database | undefined;

    /** The connection to the database */
    protected readonly connection: DataSource;

    /** The repositories */
    protected readonly apiKeyRepository: Repository<ApiKey>;
    protected readonly booleanSettingRepository: Repository<BooleanSetting>;

    /**
     * Use this method to get your database instance
     * @param options The connection options
     * @return The config database
     */
    static async getDB(
        options:
            | MysqlConnectionOptions
            | PostgresConnectionOptions
            | SqliteConnectionOptions
    ): Promise<Database> {
        let dataSource;
        if (Database.db) {
            return Database.db;
        }
        //Set additional options
        Object.assign(options, {
            entities: [ApiKey, BooleanSetting],
            name: 'config',
            logger: logger.getTypeORMLogger(),
            synchronize: true,
        });
        dataSource = await new DataSource(options).initialize();
        const d = new Database(dataSource);
        Database.db = d;
        return d;
    }

    protected constructor(d: DataSource) {
        this.connection = d;
        this.apiKeyRepository = d.getRepository(ApiKey);
        this.booleanSettingRepository = d.getRepository(BooleanSetting);
    }

    /**
     * Get all stored API Keys
     */
    getAllApiKeys(): Promise<Array<ApiKey>> {
        if (!this.connection.isInitialized)
            throw new DatabaseConnectionClosedError();

        return this.apiKeyRepository.find();
    }

    /**
     * Get a specific API Key
     * @param key
     */
    getApiKey(key: string): Promise<ApiKey> {
        if (!this.connection.isInitialized)
            throw new DatabaseConnectionClosedError();

        return this.apiKeyRepository.findOne({
            where: {
                api_key: key,
            },
        });
    }

    /**
     * Saves changes to an existing api key or creates a new one
     * @param key
     */
    setApiKey(key: ApiKey) {
        if (!this.connection.isInitialized)
            throw new DatabaseConnectionClosedError();

        return this.apiKeyRepository.save(key);
    }

    /**
     * Deletes an API Key
     * @param key
     */
    deleteApiKey(key: string | ApiKey) {
        if (!this.connection.isInitialized)
            throw new DatabaseConnectionClosedError();

        const delKey = key instanceof ApiKey ? key.api_key : key;

        return this.apiKeyRepository.delete(delKey);
    }

    /**
     * Gets a boolean setting
     * @param name
     */
    getBooleanSetting(name: string): Promise<BooleanSetting> {
        if (!this.connection.isInitialized)
            throw new DatabaseConnectionClosedError();

        return this.booleanSettingRepository.findOne({
            where: {
                name,
            },
        });
    }

    /**
     * Sets an existing or new boolean setting
     * @param setting
     */
    setBooleanSetting(setting: BooleanSetting) {
        if (!this.connection.isInitialized)
            throw new DatabaseConnectionClosedError();

        return this.booleanSettingRepository.save(setting);
    }

    /**
     * Closes the database connection
     */
    close(): Promise<void> {
        Database.db = undefined;
        return this.connection.destroy();
    }
}

/**
 * Model for boolean settings
 */
@Entity({ name: 'bool_settings' })
export class BooleanSetting {
    @PrimaryColumn()
    name!: string;

    @Column()
    value!: boolean;

    /**
     * Use this function to create a new setting
     * @param name
     * @param value
     */
    static newSetting(name: string, value: boolean): BooleanSetting {
        const s = new BooleanSetting();
        s.name = name;
        s.value = value;
        return s;
    }
}

/**
 * Model for API Keys
 */
@Entity({ name: 'api_keys' })
export class ApiKey {
    /**
     * The key itself
     */
    @PrimaryColumn()
    api_key!: string;

    /**
     * The name of the API Key
     */
    @Column()
    name!: string;

    /**
     * Viewing permission
     */
    @Column()
    view!: boolean;

    /**
     * Managing permission, e. g. changing/deleting rules
     */
    @Column()
    manage!: boolean;

    /**
     * Evaluation permission
     */
    @Column()
    evaluate!: boolean;

    /**
     * Date at which the key was created
     */
    @Column()
    created!: Date;

    /**
     * Use this function to create a new API Key
     * @param name Name of the key
     * @param view viewing permission
     * @param manage managing permission
     * @param evaluate evaluation permission
     * @param db Database to store the key in
     */
    static async generateApiKey(
        name: string,
        view: boolean,
        manage: boolean,
        evaluate: boolean,
        db: Database
    ): Promise<ApiKey> {
        const key = new ApiKey();
        //This might technically create a race condition, but there won't be too much identical api keys generated at the same time (few generations + low chance of two identical)
        do {
            key.api_key = crypto.randomUUID();
        } while (await db.getApiKey(key.api_key));
        key.name = name;
        key.view = view;
        key.manage = manage;
        key.evaluate = evaluate;
        key.created = new Date();

        return key;
    }
}
