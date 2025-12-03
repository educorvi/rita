import 'dotenv/config';

//Needed for typeORM
import 'reflect-metadata';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from '../generated/routes';
import { logger, init, DEVELOPMENT, rita, configDB } from './helper/globals';
import { errorHandler, middleware } from './helper/middleware';
import { startConfigurator } from './config/TerminalConfigurator';
import { Server } from 'http';
import process from 'node:process';

let { PORT } = process.env;
const port = PORT || '3000';

let app: Server;

function shutDown() {
    logger.log('Shutting down...');

    new Promise<void>(async (resolve) => {
        if (app) await app.close();
        logger.log('Closed http server');
        await rita.closeDBConnection();
        logger.log('Closed connection to rita db');
        await configDB.close();
        logger.log('Closed connection to config db ');
        resolve();
    }).then(() => {
        process.exit(1);
    });
}

process.once('SIGINT', shutDown);

/**
 * Start the webserver
 */
function startWebserver() {
    const httpServer = express();

    httpServer.use(middleware);

    httpServer.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: '/swagger.json',
            },
        })
    );

    RegisterRoutes(httpServer);

    httpServer.use(errorHandler);

    app = httpServer.listen(port, () => {
        logger.log('Webserver started on port ' + port);
        if (DEVELOPMENT) logger.log(`Access on http://localhost:${port}`);
    });
}

/**
 * main
 */
(async () => {
    await init();
    if (process.argv[2] === '--config') {
        await startConfigurator();
    } else {
        if (DEVELOPMENT) logger.warn('Running in development mode');
        startWebserver();
    }
})();
