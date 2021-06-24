const fs = require('fs');
const path = require('path');

const parse = require('csv-parse');

const habitablePlanet = [];

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
        .on("data", (data) => {
            if(isPlanetHabitable(data)){
                habitablePlanet.push(data);
            }
        })
        .on("error", (err) => {
            console.log(err);
            reject(err);
        })
        .on("end", () => {
            console.log(`${habitablePlanet.length} habitable planets`);
        })
        resolve();
    })
}

module.exports = {
    loadPlanetsData,
    planets: habitablePlanet
};