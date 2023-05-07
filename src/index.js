const express = require('express');
const app = express();
const config = require('./configs/env');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const route = require('./routes');
const session = require('cookie-session');
const passport = require('passport');
const cors = require('cors');

app.use(cors());

// HTTP logger
app.use(morgan('combined'));

// Cookie
app.use(cookieParser());

// Compress response
app.use(compression());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// Session
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// Route init
route(app);

app.listen(config.NODE_DOCKER_PORT || 3000, () => {
    console.log(`App listening on port ${config.NODE_DOCKER_PORT || 3000}`);
});
