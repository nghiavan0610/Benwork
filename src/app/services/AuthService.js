const { ApiError } = require('../../helpers/ErrorHandler');
const { User } = require('../../db/models');
const config = require('../../configs/env');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../helpers/Token');
const redisClient = require('../../configs/init.redis');

class AuthService {
    // [POST] /api/v1/auth/signin
    async signin(credentials) {
        try {
            const { email, password } = credentials;
            const user = await User.findOne({
                attributes: {
                    exclude: ['birthday', 'gender', 'countryId', 'about', 'phone', 'facebookId', 'googleId'],
                    include: ['password'],
                },
                where: { email },
            });

            if (user && user.comparePassword(password)) {
                delete user.dataValues.password;

                const accessToken = await generateAccessToken(user.id);
                const refreshToken = await generateRefreshToken(user.id);

                await redisClient.set(`accessToken:${user.id}`, accessToken, 'EX', config.ACCESS_TOKEN_EXPIRE);
                await redisClient.set(`refreshToken:${user.id}`, refreshToken, 'EX', config.REFRESH_TOKEN_EXPIRE);

                return [accessToken, refreshToken, user];
            } else {
                throw new ApiError(401, 'Invalid email or password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/auth/signup
    async signup(registration) {
        try {
            const { email } = registration;
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: registration,
            });

            if (!created) throw new ApiError(409, 'Email already exists');

            const accessToken = await generateAccessToken(user.id);
            const refreshToken = await generateRefreshToken(user.id);

            await redisClient.set(`accessToken:${user.id}`, accessToken, 'EX', config.ACCESS_TOKEN_EXPIRE);
            await redisClient.set(`refreshToken:${user.id}`, refreshToken, 'EX', config.REFRESH_TOKEN_EXPIRE);

            return [accessToken, refreshToken, user];
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/auth/refresh-token
    async createNewAccessToken(authorization) {
        try {
            if (!authorization) throw new ApiError(401, 'Invalid authorization');
            const refreshToken = authorization.split(' ')[1];

            if (!refreshToken) throw new ApiError(401, 'Refesh Token was not found');

            const decoded = await verifyRefreshToken(refreshToken);
            const user = await User.findByPk(decoded.userId, { attributes: ['id'] });
            const storedRefreshToken = await redisClient.get(`refreshToken:${user.id}`);

            if (!user || refreshToken !== storedRefreshToken) {
                throw new ApiError(401, 'Refresh Token has been revoked');
            }

            const accessToken = await generateAccessToken(user.id);
            await redisClient.set(`accessToken:${user.id}`, accessToken, 'EX', config.ACCESS_TOKEN_EXPIRE);

            return accessToken;
        } catch (err) {
            throw err;
        }
    }

    // [GET] api//v1/auth/signout
    async signout(userId) {
        try {
            await redisClient.del(`accessToken:${userId}`);
            await redisClient.del(`refreshToken:${userId}`);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AuthService();
