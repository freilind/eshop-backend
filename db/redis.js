const debug = require('debug')('app:redis');
const winston = require('winston');
const CustomError = require('../error/custonError')
const config = require('config');
const redis = require('redis');
const fetch = require("node-fetch");

const redisClient = redis.createClient({host:config.get('redis_url'), port:config.get('redis_port'), no_ready_check: true,
auth_pass: config.get('redis_password')});
const percentageError = config.get('percentageError');

redisClient.on('connect', () => {
    debug(`Connected to redis`);
    winston.info(`Redis`, `Connected to redis: ${config.get('redis_url')}`);
});

redisClient.on('error', err => {
    debug(`Error: ${err}`);
    winston.info(`Redis`, `Error: ${err}`);
});

redisClient.callApi = (url, keyRedis, timeExpire) => {
    let random = (Math.random() * 100).toFixed(2);
    debug(`Valor random: ${random} %`);
    winston.info(`Redis`, `Valor random: ${random} %`);
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (random <= percentageError) {
                    throw new CustomError(460, `Tasa de error ${random}`);
                } else {
                    return response;
                }
            })
            .then(response => response.json())
            .then(objects => {
                redisClient.setex(keyRedis, timeExpire, JSON.stringify(objects))
                resolve(objects);
            })
            .catch(error => {
                reject(error);
            })
    });
};

module.exports = redisClient;
