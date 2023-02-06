/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as path from 'path';

const app = express();

app.use('/api/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/ping', (req, res) => {
    res.send({ message: 'gjata' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);
