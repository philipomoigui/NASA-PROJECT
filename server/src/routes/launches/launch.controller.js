const {
    getAllLaunches,
    addNewLaunch,
} = require('../../models/launches.models')

function httpGetAllLaunches(req, res) {
    res.status(200).json(getAllLaunches());
}

function httpAddNewLAunch(req, res) {
    var launch = req.body;
    launch.launchDate = new Date(launch.launchDate);

    addNewLaunch(launch);
    res.status(200).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLAunch
}