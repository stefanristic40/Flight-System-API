const { default: axios } = require('axios');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const searchFlights = async () => {
  const flights = await axios.get(
    'https://aeroapi.flightaware.com/aeroapi/flights/search?query=-latlong+%2244.953469+-111.045360+40.962321+-104.046577%22',
    {
      headers: {
        Accept: 'application/json; charset=UTF-8',
        'x-apikey': 'mOaWBe20KPh7ZeJ1h5iwoUerKUPoftQV',
      },
    }
  );

  // eslint-disable-next-line no-console
  console.log(flights.data);
  return flights.data;
};

module.exports = {
  searchFlights,
};
