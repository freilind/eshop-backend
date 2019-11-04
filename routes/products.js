const debug = require('debug')('app:product');
const winston = require('winston');
const redis = require('../db/redis');
const auth = require('../middleware/auth');
const config = require('config');
const md5 = require('md5');
const express = require('express');
const router = express.Router();

const urlProductsByPartNumber = config.get('urlProductsByPartNumber')
const urlProductsByIdPartNumbers = config.get('urlProductsByIdPartNumbers')
const redisDataExpire = config.get('redis_data_expire');
const productsList = config.get('skuListProduct').values();

let productsSearch = '';
for (let product of productsList) {
    productsSearch = productsSearch.concat(product).concat(',');
}
productsSearch = productsSearch.slice(0, -1);
const productKeyList = md5(productsSearch);

router.get('/', auth, async (req, res, next) => {
    try {
        const functionWrapper1 = () => {
            redis.get(productKeyList, (err, products) => {
                if (products) {
                    debug(`fetching data '${productKeyList}' from cache -->`);
                    winston.info(`fetching data '${productKeyList}' from cache -->`);
                    return res.json(JSON.parse(products))
                } else {
                    debug(`fetching data '${productKeyList}' from api -->`);
                    winston.info(`fetching data '${productKeyList}' from api -->`);
                    redis.callApi(urlProductsByIdPartNumbers.concat(productsSearch), productKeyList, redisDataExpire).then(result => {
                        return res.json(result)
                    }).catch(error => {
                        winston.error("mensajeError", error);
                        debug(error.toString());
                        if (error.code === 460) {
                            functionCall1();
                        } else {
                            return res.json(error.toString());
                        }
                    })
                }
            });
            return functionWrapper1;
        };

        functionCall1();
        async function functionCall1() {
            await functionWrapper1();
        }

    } catch (ex) {
        next(ex);
    }
});

router.get('/:partNumber', auth, async (req, res, next) => {
    try {
        const functionWrapper2 = () => {
            redis.get(req.params.partNumber, (err, product) => {
                if (product) {
                    debug(`fetching data '${req.params.partNumber}' from cache -->`);
                    winston.info(`fetching data '${req.params.partNumber}' from cache -->`);
                    return res.json(JSON.parse(product))
                }
                else {
                    debug(`fetching data '${req.params.partNumber}' from api -->`);
                    winston.info(`fetching data '${req.params.partNumber}' from api -->`);
                    redis.callApi(urlProductsByPartNumber.concat(req.params.partNumber), req.params.partNumber, redisDataExpire).then(result => {
                        return res.json(result)
                    }).catch(error => {
                        winston.error("mensajeError", error);
                        debug(error.toString());
                        if (error.code === 460) {
                            functionCall2();
                        } else {
                            return res.json(error.toString());
                        }
                    });
                }
            });
            return functionWrapper2;
        };

        functionCall2();
        async function functionCall2() {
            await functionWrapper2();
        }

    } catch (ex) {
        next(ex);
    }
});

module.exports = router;