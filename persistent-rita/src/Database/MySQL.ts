import TypeORM, { DatabaseConfig, SQLModel } from './TypeORM';
import { Column, DataSource, Entity } from 'typeorm';
import { PersistentRitaLogger } from '../index';
import { DefaultConsoleLogger } from '../Helper/PersistentRitaLogger';

/**
 * MySQL Adapter
 *
 * @category Database Adapters
 */
export default class MySQL extends TypeORM {
    /**
     * Gets the singleton database.
     * @param config Configuration
     * @param logger A custom Logger
     */
    public static getDB(
        config: DatabaseConfig,
        logger: PersistentRitaLogger = new DefaultConsoleLogger()
    ): Promise<MySQL> {
        return new Promise((resolve, reject) => {
            if (MySQL.db) {
                logger.debug('Returned existing database connection');
                resolve(MySQL.db);
            } else {
                logger.debug('Start new database connection...');
                new DataSource({
                    name: 'mysql_connection',
                    type: 'mysql',
                    port: 3306,
                    ...config,
                    entities: [MySQLModel],
                    synchronize: true,
                    logger: logger.getTypeORMLogger(),
                })
                    .initialize()
                    .then((d) => {
                        MySQL.db = new MySQL(d);
                        logger.log('Database connection established');
                        resolve(MySQL.db);
                    })
                    .catch(reject);
            }
        });
    }

    newModel(): SQLModel {
        return new MySQLModel();
    }

    private constructor(d: DataSource) {
        super(d, d.getRepository(MySQLModel));
    }
}

@Entity({ name: SQLModel.database_name })
class MySQLModel extends SQLModel {
    @Column({ type: 'mediumtext' })
    declare rules: string;
}
