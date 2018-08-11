import express from "express";

import {Controller} from './controller';

// load hostname + port
const hostname: string = process.env.HOST || 'localhost';
const port: number = Number(process.env.PORT) || 3000;

// create application and controller
const app: express.Application = express();
app.use('/', Controller);
app.listen(port, hostname, () => {
    console.log(`Listening at http://${hostname}:${port}/`);
});