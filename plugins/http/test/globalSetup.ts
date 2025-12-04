import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'http';

let server: Server;

export async function setup() {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.send({
            member: true,
            employee: false,
            visit: {
                paymentDetails: {
                    payed: true,
                },
                priceWithoutTax: 10.99,
                tax: 1,
            },
            customers: [
                {
                    rated: false,
                },
                {
                    rated: true,
                },
            ],
            dateOfBirth: '2000-01-01T00:00:00+00:00',
            name: 'Julian',
        });
    });

    app.post('/', (req, res) => {
        res.send({
            response: req.body,
        });
    });

    await new Promise<void>((resolve) => {
        server = app.listen(3123, '127.0.0.1', function () {
            console.log(`Running server on '127.0.0.1:3123`);
            resolve();
        });
    });
}

export async function teardown() {
    if (server) {
        server.close();
    }
}
