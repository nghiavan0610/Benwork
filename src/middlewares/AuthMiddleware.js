const { ApiError } = require('../helpers/ErrorHandler');
const { verifyAccessToken } = require('../helpers/Token');
const redisClient = require('../configs/init.redis');
const passport = require('passport');
const { User } = require('../db/models');

const authenticateToken = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        const { authorization } = req.headers;

        if (!authorization || !authorization.startsWith('Bearer')) {
            throw new ApiError(401, 'Invalid authorization');
        }

        const accessToken = authorization.split(' ')[1];
        if (!accessToken) {
            throw new ApiError(401, 'Access Token was not found');
        }

        const payload = await verifyAccessToken(accessToken);

        const user = await User.findByPk(payload.userId, { attributes: ['id', 'name', 'avatarUrl', 'role', 'slug'] });
        if (!user) {
            throw new ApiError(401, `Account does not exist`);
        }
        const storedAccessToken = await redisClient.get(`accessToken:${user.id}`);
        if (accessToken !== storedAccessToken) {
            throw new ApiError(401, 'Access token has been revoked');
        }
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            next(new ApiError(401, 'Access token has been time out'));
        }
        next(err);
    }
};

module.exports = { authenticateToken };
