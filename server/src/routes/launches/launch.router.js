const express = require('express');

const {
    getAllLaunches,
} = require('./launch.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);

module.exports = launchesRouter;