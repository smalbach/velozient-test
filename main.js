// Import the necessary modules and functions.
const { parseInput } = require('./cleanData');
const { knapsack } = require('./utils');
const data =  require('fs').readFileSync('Input.txt', 'utf8');

// Parse the input data to get drones and locations.
const { drones, locations } = parseInput(data);

/**
 * Constructs a DroneTrip object to represent a drone's trips.
 * @param {Object} drone - The drone undertaking the trips.
 * @param {Array} trips - An array of trip objects for the drone.
 */
function DroneTrip(drone, trips) {
  this.drone = drone;
  this.trips = trips;
}

/**
 * Calculates the total weight of a set of items.
 * @param {Array} items - The items whose weights are to be summed.
 * @returns {number} - The total weight of the items.
 */
const calculateWeight = (items) => {
  return items.reduce((acc, item) => acc + parseInt(item.weight), 0);
}

/**
 * Calculates all possible trips for a given drone based on its capacity and a set of locations.
 * @param {Object} drone - The drone for which to calculate trips.
 * @param {Array} locations - The locations to be considered for trips.
 * @returns {DroneTrip} - An object representing the drone and its trips.
 */
const calculateAllDroneTrips = (drone, locations) => {
  const trips = [];
  let remainingLocations = locations.slice();
  let remainingCapacity = parseInt(drone.capacity);

  while (remainingLocations.length > 0) {
    remainingLocations = remainingLocations.filter(loc => parseInt(loc.weight) <= remainingCapacity);

    const selectedItems = knapsack(remainingLocations, remainingCapacity);
    trips.push({items: [...selectedItems], totalWeight: calculateWeight(selectedItems)}); 
    selectedItems.forEach(item => {
      const index = remainingLocations.findIndex(loc => loc.name === item.name);
      if (index !== -1) {
          remainingLocations.splice(index, 1);
        }
      });
  }
  const droneTrip = new DroneTrip(drone, trips);
  return droneTrip;
}

/**
 * Verifies if another drone can carry a load of a specific capacity.
 * @param {number} capacity - The capacity required for the load.
 * @returns {Object|null} - The drone that can carry the load, or null if none can.
 */
const verifyIfOtherDroneCanCarry= (capacity) => {
  for (let i = 1; i < drones.length; i++) {
    const drone = drones[i];
    if (parseInt(drone.capacity) >= capacity) {
      return drone;
    }
  }
  return null;
}

/**
 * Main function to calculate and output the final trips of drones.
 */
const main = () => {
  const finalTrips = [];
  let tripCount = 0;

  const maxDroneTrips = calculateAllDroneTrips(drones[0], locations);
    maxDroneTrips.trips.forEach((trip, i) => {
      const otherDrone = verifyIfOtherDroneCanCarry(trip.totalWeight);
      if (otherDrone === null) {
        tripCount++;
        finalTrips.push({trip: tripCount, drone: drones[0], items: trip.items});
      } else {
        finalTrips.push({trip: tripCount,drone: otherDrone, items: trip.items});
      }
  });

  const output = [];

  // Generate output for each drone's trips.
  drones.forEach((drone) => {
    const droneTrips = finalTrips.filter(trip => trip.drone.name === drone.name);
    output.push(`[${drone.name.trim()}]`);
    droneTrips.forEach((trip, i) => {
      output.push(`Trip ${i + 1}`);
      output.push(`${trip.items.map(item => `[${item.name}]`).join(', ')}`);
    });
    output.push('');
  });

  console.log(output.join('\n'));

  // Write the output to a file.
  require('fs').writeFileSync('OutputResult.txt', output.join('\n'), 'utf8');
}

// Execute the main function.
main();