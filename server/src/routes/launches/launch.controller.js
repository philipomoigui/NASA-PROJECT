const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.models')

async function httpGetAllLaunches(req, res) {
    res.status(200).json(await getAllLaunches());
}

async function httpAddNewLAunch(req, res) {
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

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch (req, res) {
    const launchId = Number(req.params.id);

    const existLaunch = await existsLaunchWithId(launchId);

    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch not found',
        })
    }

    const aborted = await abortLaunchById(launchId);

    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }
    return res.status(200).json({
        ok: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLAunch,
    httpAbortLaunch
}