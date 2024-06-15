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

const searchFlightsPositions = catchAsync(async (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.query;

  const now = new Date();
  const timestamp = now.getTime();

  const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const fifteenMinsAgoTimestamp = fifteenMinsAgo.getTime();

  const initialUrl = `${AERO_API_URL}/flights/search/positions?query={range%20lat%20${lat1}%20${lat2}%20range%20lon%20${lon1}%20${lon2}}%20{>=%20clock%20${fifteenMinsAgoTimestamp}}%20{<=%20clock%20${timestamp}}`;

  const headers = {
    Accept: 'application/json; charset=UTF-8',
    'x-apikey': config.aero_api_key,
  };

  let allFlights = [];
  let nextUrl = initialUrl;

  while (nextUrl) {
    // eslint-disable-next-line no-await-in-loop
    const response = await axios.get(nextUrl, { headers });
    const { flights, links } = response.data;

    allFlights = allFlights.concat(flights);
    nextUrl = links && links.next ? `${AERO_API_URL}${links.next}` : null;
  }

  res.status(httpStatus.OK).send({ flights: allFlights });
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
  searchFlightsPositions,
};
