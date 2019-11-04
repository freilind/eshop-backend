const admin = require("firebase-admin");
const winston = require('winston');
const debug = require('debug')('app:auth');

const getAuthToken = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

const auth = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            req.authId = userInfo.uid;
            debug(`id: ${req.authId}`);
            return next();
        } catch (ex) {
            debug(`No estas autorizado.`);
            winston.error(ex.message, ex);
            return res.status(401).send({ error: 'No estas autorizado.' });
        }
    });
};

module.exports = auth;