const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

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

async function populateLaunch() {
    console.log('Downloading launch data ........');

    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
      });

    const launchDocs = response.data.docs;
    

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
        return payload['customers'];
    })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success']
        }

        saveLaunch(launch);
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch) {
        console.log('Launch data already loaded');
    } else {
        populateLaunch();
    }
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId (launchId) {
    return await findLaunch({
        flightNumber: launchId
    });
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
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if (!planet) {
        throw new Error('No Matching Planet Found');
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    Object.assign(launch, {
        flightNumber: newFlightNumber,
        success: true,
        upcoming: true,
        customers: ['Bill Gate', 'Shev Junkie']
    });

    await saveLaunch(launch);
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return aborted.nModified === 1 && aborted.ok === 1;
}

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}