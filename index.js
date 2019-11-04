const error = require('./middleware/error');
const config = require('config');
const morgan = require('morgan');
const logger = require('./logger');
const winston = require('winston');
const products = require('./routes/products');
const auth = require('./routes/auth');
const express = require('express');
const cors = require('cors')
const app = express();
const debug = require('debug')('app:startup');

winston.add(winston.transports.File,{filename: 'logfile.log'});
winston.handleExceptions(new winston.transports.File({filename: 'uncaughtException.log'}));

process.on('unhandledRejection', (ex) => {
  throw ex;
});

const name = config.get('name');
const env = config.get('env');
const port = config.get('port');
const redisUrl = config.get('redis_url');
const redisPort = config.get('redis_port');

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(logger);

if (env === 'development') {
    app.use(morgan('tiny'));
    debug(`Morgan enabled...`);
}

app.use('/api/products',products);
app.use('/auth', auth);
app.use(error);

require('./startup/prod')(app);

debug(`Application name: ${name}`);
debug(`Application env: ${env}`);
debug(`Application port: ${port}`);
debug(`Redis url: ${redisUrl}`);
debug(`Redis port: ${redisPort}`);

app.listen(port, () => console.log(`Listening on port ${port}...`));
