const admin = require("firebase-admin");
const config = require('config');
const express = require('express');
const router = express.Router();

admin.initializeApp({
    credential: admin.credential.cert(config.get('googleCert')),
    databaseURL: config.get('firebase.databaseURL')
});

router.get("/isAuth/:token", function (req, res) {

    var token = req.params.token;

    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
            var uid = decodedToken.uid;
            res.send(`Current User ID: ${uid}`);
        }).catch(function (error) {
            res.send(`error ${error}`);
        });
});

module.exports = router;