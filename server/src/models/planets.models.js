const fs = require('fs');
const path = require('path');

const parse = require('csv-parse');
const planets = require('./planets.mongo');


function isPlanetHabitable(data) {
    return data.koi_disposition === "CONFIRMED" &&  data.koi_insol > 0.36 && data.koi_insol < 1.11
    && data.koi_prad < 1.6
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'Kepler_data.csv'))
        .pipe(parse({
            comment: "#",
            columns: true
        }))
        .on("data", async (data) => {
            if (isPlanetHabitable(data)){
                 await savePlanet(data);
            }
        })
        .on("error", (err) => {
            console.log(err);
            reject(err);
        })
        .on("end", async () => {
            const habitablePlanetCount = await planets.countDocuments();
            console.log(`${habitablePlanetCount} habitable planets found`);
        })
        resolve();
    })
}

async function getAllPlanets() {
    return await planets.find({});
}

//upsert method
async function savePlanet(planet) {
    try {
       await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch (err) {
        console.error(`Could not save planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};