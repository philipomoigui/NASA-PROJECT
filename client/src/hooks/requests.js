const API_URL = 'http://localhost:8000';

  // Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

 // Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedResponse =  await response.json();
  return fetchedResponse.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
 try {
   return await fetch(`${API_URL}/launches`, {
     method: "post",
     headers: {
       "Content-Type": "application/json"
     },
     data: JSON.stringify(launch)
   })
 } catch (err) {
   return {
     ok: false
   }
 }
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};