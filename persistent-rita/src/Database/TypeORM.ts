import { Column, DataSource, PrimaryColumn, Repository } from 'typeorm';
import { DatabaseConnectionClosedError } from '../Helper/Errors';
import Ruleset from '../Ruleset';
import DatabaseInterface from '../DatabaseInterface';
import { PersistentRita } from '../PersistentRita';

export type DatabaseConfig = {
    database: string;
    host: string;
    port?: number;
    username?: string;
    password?: string;
};

/**
 * Parent class for TypeORM based DB-Adapters.
 * Uses singleton pattern
 * @category Database Adapters
 */
export default abstract class TypeORM implements DatabaseInterface {
    /** The database instance (singleton pattern) */
    protected static db: TypeORM | undefined;

    /** The connection to the database */
    protected readonly dataSource: DataSource;
    /** The repository */
    protected readonly repository: Repository<SQLModel>;

    protected constructor(c: DataSource, r: Repository<SQLModel>) {
        this.dataSource = c;
        this.repository = r;
    }

    /**
     * Gets a new model to save data into
     */
    abstract newModel(): SQLModel;

    deleteRuleset(id: string): Promise<void> {
        if (!this.dataSource.isInitialized)
            throw new DatabaseConnectionClosedError();

        return new Promise((resolve, reject) => {
            this.repository
                .delete(id)
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }

    getRuleset(id: string): Promise<Ruleset | undefined> {
        if (!this.dataSource.isInitialized)
            throw new DatabaseConnectionClosedError();

        return new Promise((resolve, reject) => {
            this.repository
                .findOne({
                    where: {
                        id: id
                    }
                })
                .then((res) => resolve(res?.toRita()))
                .catch(reject);
        });
    }

    listRulesets(): Promise<Array<Ruleset>> {
        if (!this.dataSource.isInitialized)
            throw new DatabaseConnectionClosedError();

        return new Promise((resolve, reject) => {
            this.repository
                .find()
                .then((res) => resolve(res.map((item) => item.toRita())))
                .catch(reject);
        });
    }

    // @ts-ignore
    saveRuleset(id: string, data: Ruleset): Promise<void> {
        if (!this.dataSource.isInitialized)
            throw new DatabaseConnectionClosedError();

        return new Promise((resolve, reject) => {
            this.repository
                .save(this.newModel().setData(data))
                .then(() => resolve())
                .catch(reject);
        });
    }

    deleteAllRulesets(): Promise<void> {
        return this.repository.clear();
    }

    close(): Promise<void> {
        TypeORM.db = undefined;
        return this.dataSource.destroy();
    }
}

/**
 * Class to setup the TypeORM Models.
 * Contains the columns and functions that are similar over all TypeORM adapters.
 */
export abstract class SQLModel {
    @PrimaryColumn()
    id!: string;

    @Column()
    name!: string;

    @Column({ type: 'varchar', length: 500 })
    description!: string;

    rules!: string;

    static database_name: string = 'rita_data';

    /**
     * Load data into this model
     * @param ruleset The ruleset to load
     */
    public setData(ruleset: Ruleset): SQLModel {
        this.id = ruleset.id;
        this.name = ruleset.name;
        this.description = ruleset.description;
        this.rules = JSON.stringify(
            ruleset.getAllRules().map((rule) => rule.toJsonReady())
        );
        return this;
    }

    /**
     * Convert this model to a Rita ruleset
     */
    public toRita(): Ruleset {
        return new Ruleset(
            this.id,
            this.name,
            PersistentRita.parser.parseRuleSet({ rules: JSON.parse(this.rules) }),
            this.description
        );
    }
}
