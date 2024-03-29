require('dotenv').config();

const {
    NODE_ENV,
    NODE_DOCKER_PORT,

    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,

    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_LOCAL_PORT,
    DB_DOCKER_PORT,
    DB_NAME,
    DB_DIALECT,

    REDIS_USER,
    REDIS_PASSWORD,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_URL,

    NGINX_DOCKER_PORT,
    NGINX_LOCAL_PORT,

    CLOUDINARY_NAME,
    CLOUDINARY_KEY,
    CLOUDINARY_SECRET,

    SESSION_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL,

    GOOGLE_APP_ID,
    GOOGLE_APP_SECRET,
    GOOGLE_CALLBACK_URL,
} = process.env;

const config = {
    NODE_ENV,
    NODE_DOCKER_PORT,

    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRE,
    REFRESH_TOKEN_EXPIRE,

    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DOCKER_PORT,
    DB_LOCAL_PORT,
    DB_NAME,
    DB_DIALECT,

    REDIS_HOST,

    NGINX_DOCKER_PORT,
    NGINX_LOCAL_PORT,

    CLOUDINARY_NAME,
    CLOUDINARY_KEY,
    CLOUDINARY_SECRET,

    DATABASE_URL: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,

    SESSION_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL,

    GOOGLE_APP_ID,
    GOOGLE_APP_SECRET,
    GOOGLE_CALLBACK_URL,
};

module.exports = config;
