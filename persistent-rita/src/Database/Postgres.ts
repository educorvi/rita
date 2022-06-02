import TypeORM, { DatabaseConfig, SQLModel } from './TypeORM';
import { Column, DataSource, Entity } from 'typeorm';
import { PersistentRitaLogger } from '../index';
import { DefaultConsoleLogger } from '../Helper/PersistentRitaLogger';

/**
 * Postgres Adapter
 *
 * @category Database Adapters
 */
export default class Postgres extends TypeORM {
    /**
     * Gets the singleton database.
     * @param config Configuration
     * @param logger A custom Logger
     */
    public static getDB(
        config: DatabaseConfig,
        logger: PersistentRitaLogger = new DefaultConsoleLogger(),
    ): Promise<Postgres> {
        return new Promise((resolve, reject) => {
            if (Postgres.db) {
                logger.debug('Returned existing database connection');
                resolve(Postgres.db);
            } else {
                logger.debug('Start new database connection...');
                new DataSource({
                    name: 'postgres_connection',
                    type: 'postgres',
                    port: 5432,
                    ...config,
                    entities: [PostgresModel],
                    synchronize: true,
                    logger: logger.getTypeORMLogger(),
                }).initialize()
                    .then((d) => {
                        Postgres.db = new Postgres(d);
                        logger.log('Database connection established');
                        resolve(Postgres.db);
                    })
                    .catch(reject);
            }
        });
    }

    newModel(): SQLModel {
        return new PostgresModel();
    }

    private constructor(d: DataSource) {
        super(d, d.getRepository(PostgresModel));
    }
}

@Entity({ name: SQLModel.database_name })
class PostgresModel extends SQLModel {
    @Column({ type: 'text' })
    rules!: string;
}
