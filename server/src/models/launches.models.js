const launches =  new Map();

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

let latestFlightNumber = launch.flightNumber;

launches.set(launch.flightNumber, launch);

function existsLaunchWithId (launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return [...launches.values()];
}

function addNewLaunch(launch){
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        flightNumber: latestFlightNumber,
        success: true,
        upcoming: true,
        customers: ['Bill Gate', 'Shev Junkle']
    }))
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
    addNewLaunch,
    abortLaunchById
}