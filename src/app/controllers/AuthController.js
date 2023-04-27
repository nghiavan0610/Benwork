const authService = require('../services/AuthService');
const config = require('../../configs/env');
const { response } = require('../../helpers/Response');

class AuthController {
    // [POST] /api/v1/auth/signin
    async signin(req, res, next) {
        try {
            const credentials = req.body;
            const [accessToken, refreshToken, user] = await authService.signin(credentials);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: config.ACCESS_TOKEN_EXPIRE * 1000,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: config.REFRESH_TOKEN_EXPIRE * 1000,
            });
            res.status(200).json(response({ accessToken, refreshToken, user }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/auth/signup
    async signup(req, res, next) {
        try {
            const registration = req.body;
            const [accessToken, refreshToken, user] = await authService.signup(registration);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: config.ACCESS_TOKEN_EXPIRE * 1000,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: config.REFRESH_TOKEN_EXPIRE * 1000,
            });
            res.status(200).json(response({ accessToken, refreshToken, user }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] api//v1/auth/refresh-token
    async createNewAccessToken(req, res, next) {
        try {
            const { authorization } = req.headers;
            const refreshToken = authorization.split(' ')[1];
            const accessToken = await authService.createNewAccessToken(refreshToken);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: config.ACCESS_TOKEN_EXPIRE * 1000,
            });
            res.status(201).json(response({ accessToken }));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/auth/signout
    async signout(req, res, next) {
        try {
            if (req.jti) {
                await deleteToken(req.jti);
                res.cookie('jwt', '', { maxAge: '1' });
            } else {
                req.logout((err) => {
                    return next(err);
                });
            }

            res.status(200).json(response(`You've been logged out`));
        } catch (err) {
            next(err);
        }
    }

    // [GET] api//v1/auth/signout
    async signout(req, res, next) {
        try {
            const userId = req.user.id;
            await authService.signout(userId);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.status(200).json(response(`You've been logged out`));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController();
