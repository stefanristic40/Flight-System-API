const httpStatus = require('http-status');
const { default: axios } = require('axios');

const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const fetchAllFlights = async (url, headers) => {
  let allFlights = [];
  let nextUrl = url;

  while (nextUrl) {
    // eslint-disable-next-line no-await-in-loop
    const response = await axios.get(nextUrl, { headers });
    const { flights, links } = response.data;

    allFlights = allFlights.concat(flights);
    nextUrl = links && links.next ? `https://aeroapi.flightaware.com/aeroapi${links.next}` : null;
  }

  return allFlights;
};

const searchFlights = catchAsync(async (req, res) => {
  //   28.152890667136678, -82.55100763322196
  // 28.105578910933378, -82.47799101938415
  const initialUrl =
    'https://aeroapi.flightaware.com/aeroapi/flights/search?query=-latlong+%2244.953469+-111.045360+40.962321+-104.046577%22';
  // const initialUrl =
  //   'https://aeroapi.flightaware.com/aeroapi/flights/search?query=-latlong+%2228.152890667136678+-82.55100763322196+28.105578910933378+-82.47799101938415%22';
  const headers = {
    Accept: 'application/json; charset=UTF-8',
    'x-apikey': config.aero_api_key,
  };

  const flights = await fetchAllFlights(initialUrl, headers);

  res.status(httpStatus.OK).send({ flights });
});

const getFlightTrack = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const headers = {
      Accept: 'application/json; charset=UTF-8',
      'x-apikey': config.aero_api_key,
    };

    const response = await axios.get(`https://aeroapi.flightaware.com/aeroapi/flights/${id}/track`, { headers });

    res.status(httpStatus.OK).send(response.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(httpStatus.NOT_FOUND).send({ error: 'Flight not found' });
  }
});

module.exports = {
  searchFlights,
  getFlightTrack,
};
