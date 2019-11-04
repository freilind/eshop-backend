
const winston = require('winston');

const error = (err, req, res, next) => {
    winston.error(err.message, err);
    res.ststus(500).send('Ha ocurrido un error.');
}

module.exports = error;