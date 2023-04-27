const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require('../config/env');
const { User } = require('../db/models');

// JWT Authentication
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, next) => {
    try {
        const user = await User.findByPk(payload.id);
        if (user) {
            return next(null, { user, jti: payload.jti });
        } else {
            return next(null, false);
        }
    } catch (err) {
        next(err);
    }
});

// Facebook Authentication
const fbOptions = {
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_CALLBACK_URL,
};
const fbLogin = new FacebookStrategy(fbOptions, async (accessToken, refreshToken, profile, cb) => {
    try {
        const [user, created] = await User.findOrCreate({
            where: { facebookId: profile.id },
            defaults: {
                name: profile.displayName,
            },
        });
        return cb(null, user);
    } catch (err) {
        cb(err);
    }
});

// Google Authentication
const ggOptions = {
    clientID: config.GOOGLE_APP_ID,
    clientSecret: config.GOOGLE_APP_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
};

const ggLogin = new GoogleStrategy(ggOptions, async (accessToken, refreshToken, profile, cb) => {
    try {
        const [user, created] = await User.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
                name: profile.displayName,
            },
        });
        return cb(null, user);
    } catch (err) {
        cb(err);
    }
});

passport.use(jwtLogin);
passport.use(fbLogin);
passport.use(ggLogin);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
