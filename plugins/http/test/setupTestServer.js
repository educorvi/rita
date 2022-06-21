const express = require('express');
const app = express();
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

module.exports = async () => {
    let server;
    await new Promise(function (resolve) {
        server = app.listen(3123, '127.0.0.1', function () {
            let address = server.address();
            console.log(`\nRunning server on '${JSON.stringify(address)}'...`);
            resolve();
        });
    });
    let address = server.address();
    global.server = server;
    global.address = `${address.address}:${address.port}`;
};
