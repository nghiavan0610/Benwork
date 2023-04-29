const express = require('express');
const v1Router = express.Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const profileRouter = require('./profile');
const gigsRouter = require('./gigs');
const listsRouter = require('./lists');
const ordersRouter = require('./orders');
const complementRouter = require('./complement');
const categoriesRouter = require('./categories');

v1Router.use('/auth', authRouter);
v1Router.use('/users', usersRouter);
v1Router.use('/profile', profileRouter);
v1Router.use('/gigs', gigsRouter);
v1Router.use('/lists', listsRouter);
v1Router.use('/orders', ordersRouter);
v1Router.use('/complement', complementRouter);
v1Router.use('/categories', categoriesRouter);

module.exports = v1Router;
