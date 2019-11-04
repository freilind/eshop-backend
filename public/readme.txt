El readme del proyecto.

Variables de entorno

export PORT
export NODE_ENV
export REDIS_URL
export REDIS_PORT


Para activar el debug en la aplicación para distintos namespaces.
export DEBUG=app:startup
export DEBUG=app:*

deplomyment heroku
    heroku login
    heroku create
    git push heroku master

    //set Variables de entorno
    heroku config:set PORT=8090
    heroku config:set NODE_ENV=production
    heroku config:set DEBUG=app:*

recursos
https://nisum.udemy.com/course/nodejs-master-class
https://github.com/NodeRedis/node_redis#rediscreateclient
https://jsonworld.com/demo/caching-with-redis-in-nodejs-application
