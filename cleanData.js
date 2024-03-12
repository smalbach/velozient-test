/**
 * Parses the provided data string into an array of values, after cleaning and splitting.
 * @param {string} data - The raw input data as a string.
 * @returns {Array} finalArray - An array of cleaned data values.
 */
const parseData = (data) => {
  let lines;
  let finalArray = [];
  // Ensure that the input data is not empty or undefined.
  if (data) {
    // Split the input data into lines.
    lines = data.split('\n');
  }
  // Filter out empty lines, remove brackets, carriage returns, and trim whitespace.
  lines = lines.filter((line) => line !== '')
              .map((line) => line.replace(/[\[\]]/g, '').replace(/\r/g, '').trim());
  // Split each line by comma and add each item to the final array.
  lines.forEach((line) => {
    line.split(',').map((item) => {
      finalArray.push(item);
    });
  });
  return finalArray;
}

/**
 * Sorts an array of location objects in descending order by weight.
 * @param {Array} locations - An array of location objects with 'weight' properties.
 * @returns {Array} - The sorted array of locations.
 */
function sortByWeightDescending(locations) {
  return locations.sort((a, b) => b.weight - a.weight);
}

/**
 * Sorts an array of drone objects in descending order by capacity.
 * @param {Array} drones - An array of drone objects with 'capacity' properties.
 * @returns {Array} - The sorted array of drones.
 */
function sortByCapacityDescending(drones) {
  return drones.sort((a, b) => b.capacity - a.capacity);
}

/**
 * Processes the parsed data to fill arrays of drones and locations, each sorted by capacity and weight respectively.
 * @param {Array} data - The parsed input data as an array of strings.
 * @returns {Object} - An object containing sorted arrays of drones and locations.
 */
const fillDronesAndCapacity = (data) => {
  const drones = [];
  const locations = [];

  for (let i = 0; i < data.length; i++) {
    // Identify drone entries and validate subsequent capacity value.
    if (typeof data[i] === 'string' && data[i].toLowerCase().includes('drone')) {
      if(data[i + 1] === undefined || data[i + 1] === '' || data[i + 1] === null) {
        throw new Error('Drone capacity is missing');
      }
      drones.push({ name: data[i], capacity: parseFloat(data[i + 1].trim()) });
    }

    // Identify location entries and validate subsequent weight value.
    if (typeof data[i] === 'string' && data[i].toLowerCase().includes('location')) {
      if(data[i + 1] === undefined || data[i + 1] === '' || data[i + 1] === null) {
        throw new Error('Location weight is missing');
      }
      locations.push({name: data[i], weight: parseFloat(data[i + 1].trim())});
    }
  }

  // Sort the drones and locations by capacity and weight respectively before returning.
  return { drones: sortByCapacityDescending(drones), locations: sortByWeightDescending(locations) };
}

/**
 * Main function to parse input data and organize drone and location information.
 * @param {string} data - The raw input data as a string.
 * @returns {Object} - Sorted arrays of drones and locations based on capacity and weight.
 */
function parseInput(data) {
  let newData = parseData(data);
  return fillDronesAndCapacity(newData);
}

// Export the main function to be available for other modules.
module.exports = { parseInput };