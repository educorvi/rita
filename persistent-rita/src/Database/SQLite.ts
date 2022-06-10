import 'reflect-metadata';
import { Column, DataSource, Entity } from 'typeorm';
import TypeORM, { SQLModel } from './TypeORM';
import { PersistentRitaLogger } from '../index';
import { DefaultConsoleLogger } from '../Helper/PersistentRitaLogger';

/**
 * SQLite Adapter
 *
 * @category Database Adapters
 */
export default class SQLite extends TypeORM {
    /**
     * Gets the singleton database.
     * @param sqlitePath The path of the sqlite database
     * @param logger A custom Logger
     */
    public static getDB(
        sqlitePath: string = './sqlite.db',
        logger: PersistentRitaLogger = new DefaultConsoleLogger()
    ): Promise<SQLite> {
        return new Promise((resolve, reject) => {
            if (SQLite.db) {
                logger.debug('Returned existing database connection');
                resolve(SQLite.db);
            } else {
                logger.debug('Start new database connection...');
                new DataSource({
                    name: 'sqlite_connection',
                    type: 'sqlite',
                    database: sqlitePath,
                    entities: [SQLiteModel],
                    synchronize: true,
                    logger: logger.getTypeORMLogger(),
                })
                    .initialize()
                    .then((d) => {
                        SQLite.db = new SQLite(d);
                        logger.log('Database connection established');
                        resolve(SQLite.db);
                    })
                    .catch(reject);
            }
        });
    }

    newModel(): SQLModel {
        return new SQLiteModel();
    }

    private constructor(d: DataSource) {
        super(d, d.getRepository(SQLiteModel));
    }
}

@Entity({ name: SQLModel.database_name })
class SQLiteModel extends SQLModel {
    @Column()
    rules!: string;
}
