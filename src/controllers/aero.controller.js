const httpStatus = require('http-status');
const { default: axios } = require('axios');

const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const AERO_API_URL = 'https://aeroapi.flightaware.com/aeroapi';

const fetchAllFlights = async (url, headers) => {
  let allFlights = [];
  let nextUrl = url;

  while (nextUrl) {
    // eslint-disable-next-line no-await-in-loop
    const response = await axios.get(nextUrl, { headers });
    const { flights, links } = response.data;

    allFlights = allFlights.concat(flights);
    nextUrl = links && links.next ? `${AERO_API_URL}${links.next}` : null;
  }

  return allFlights;
};

const searchFlights = catchAsync(async (req, res) => {
  // Get query params
  const { lat1, lon1, lat2, lon2 } = req.query;
  const initialUrl = `${AERO_API_URL}/flights/search?query=-latlong+%22${lat1}+${lon1}+${lat2}+${lon2}%22`;

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

    const response = await axios.get(`${AERO_API_URL}/flights/${id}/track`, { headers });

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
