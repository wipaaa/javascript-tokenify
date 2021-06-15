const express = require('express');
const constants = require('./configs/constants');
const routesV1 = require('./routes/v1');
const routesV2 = require('./routes/v2');

const app = express();
const port = constants.serverPort;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

app.listen(port, () => console.log(`Listening at: ${port}`));
