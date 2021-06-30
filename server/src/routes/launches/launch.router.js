const express = require('express');

const {
    httpGetAllLaunches,
    httpAddNewLAunch,
    httpAbortLaunch
} = require('./launch.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLAunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;