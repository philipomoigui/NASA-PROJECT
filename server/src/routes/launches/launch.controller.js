const {
    getAllLaunches,
    addNewLaunch,
} = require('../../models/launches.models')

function httpGetAllLaunches(req, res) {
    res.status(200).json(getAllLaunches());
}

function httpAddNewLAunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({
            error: 'Missing required launch parameters'
        });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) { 
        return res.status(400).json({
            error: 'Invalid Launch Date'
        })
    }

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLAunch
}