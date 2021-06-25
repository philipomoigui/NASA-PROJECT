const express = require('express');

const {
    httpGetAllLaunches,
    httpAddNewLAunch
} = require('./launch.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLAunch);

module.exports = launchesRouter;