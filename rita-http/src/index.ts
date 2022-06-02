import dotenv from "dotenv"

dotenv.config();

//Needed for typeORM
import "reflect-metadata";

import express from "express";
import swaggerUi from "swagger-ui-express";
import {RegisterRoutes} from "../generated/routes";
import {logger, init, DEVELOPMENT, rita, configDB} from "./helper/globals";
import {errorHandler, middleware} from "./helper/middleware";
import {startConfigurator} from "./config/TerminalConfigurator";

let {API_PORT} = process.env;
const port = API_PORT || "3000"

process.on('SIGINT', function () {
    logger.log('Shutting down...');

    new Promise<void>(async resolve => {
        await rita.closeDBConnection();
        logger.log("Closed connection to rita db")
        await configDB.close();
        logger.log("Closed connection to config db ")
        resolve();
    }).then(() => {
        process.exit(1);
    });

});


/**
 * Start the webserver
 */
function startWebserver() {
    const httpServer = express();

    httpServer.use(middleware);

    httpServer.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(undefined, {
            swaggerOptions: {
                url: "/swagger.json",
            },
        })
    );

    RegisterRoutes(httpServer);

    httpServer.use(errorHandler);

    httpServer.listen(port, () => {
        logger.log("Webserver started on port " + port);
        if(DEVELOPMENT) logger.log(`Access on http://localhost:${port}`)
    });
}


/**
 * main
 */
(async () => {

    await init();
    if (process.argv[2] === "--config") {
        await startConfigurator();
    } else {
        if(DEVELOPMENT) logger.warn("Running in development mode. Set NODE_ENV Environment Variable to \"production\" when running in production.")
        startWebserver();
    }

})();
