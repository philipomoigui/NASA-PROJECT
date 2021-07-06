const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 30, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'Bill'],
    upcoming: true,
    success: true
}

saveLaunch(launch);

function existsLaunchWithId (launchId) {
    return launches.has(launchId);
}

async function getLatestFlightNumber () {
    const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');

    if (!launch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '_id': 0, '__v': 0
    })
}

async function saveLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('No Matching Planet Found');
    }

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    Object.assign(launch, {
        flightNumber: newFlightNumber,
        success: true,
        upcoming: true,
        customers: ['Bill Gate', 'Shev Junkie']
    });

    await saveLaunch(launch);
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);

    aborted.upcoming = false;
    aborted.success = false;

    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}