const {launches} = require('../../models/launches.models')

function getAllLaunches(req, res) {
    res.status(200).json([...launches.values()]);
}

module.exports = {
    getAllLaunches,
}