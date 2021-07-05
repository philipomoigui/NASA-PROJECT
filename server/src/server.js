const http = require('http');

const app = require('./app');
const {loadPlanetsData} = require('./models/planets.models');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();

// fPlHc1yRT8qf0jH9

// mongodb+srv://nasa-api:fPlHc1yRT8qf0jH9@nasa.gg0za.mongodb.net/myFirstDatabase?retryWrites=true&w=majority