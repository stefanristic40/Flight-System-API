const httpStatus = require('http-status');
const { default: axios } = require('axios');

const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');

const AERO_API_URL = 'https://aeroapi.flightaware.com/aeroapi';

const searchFlights = catchAsync(async (req, res) => {
  // Get query params
  const { lat1, lon1, lat2, lon2 } = req.query;
  const initialUrl = `${AERO_API_URL}/flights/search?query=-latlong+%22${lat1}+${lon1}+${lat2}+${lon2}%22`;

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
    if (flights && flights.length > 0) {
      allFlights = allFlights.concat(flights);
    }
    nextUrl = links && links.next ? `${AERO_API_URL}${links.next}` : null;
  }

  res.status(httpStatus.OK).send({ flights: allFlights });
});

const searchFlightsPositions = catchAsync(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const { lat1, lon1, lat2, lon2 } = req.query;

  const now = new Date();

  const headers = {
    Accept: 'application/json; charset=UTF-8',
    'x-apikey': config.aero_api_key,
  };

  const timesteampGapMinutes = 15;
  const allFlights = [];

  for (let i = 0; i < (1 * 60) / timesteampGapMinutes; i += 1) {
    const startTimeStamp = now.getTime() - (i + 1) * timesteampGapMinutes * 60 * 1000;
    const endTimeStamp = now.getTime() - i * timesteampGapMinutes * 60 * 1000;

    const url = `${AERO_API_URL}/flights/search/positions?query={range%20lat%20${lat1}%20${lat2}}%20{range%20lon%20${lon1}%20${lon2}}%20{>=%20clock%20${Math.floor(
      startTimeStamp / 1000
    )}}%20{<=%20clock%20${Math.floor(endTimeStamp / 1000)}}&unique_flights=true`;

    // eslint-disable-next-line no-console
    console.log('url', url);

    let nextUrl = url;

    while (nextUrl) {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.get(nextUrl, { headers });
      const { positions, links } = response.data;

      // eslint-disable-next-line no-console
      console.log('positions', positions.length);

      if (positions && positions.length > 0) {
        for (let j = 0; j < positions.length; j += 1) {
          const position = positions[j];
          const flight = allFlights.find((f) => f.fa_flight_id === position.fa_flight_id);
          if (!flight) {
            // Fetch Flight Position
            // eslint-disable-next-line no-await-in-loop
            const flightResponse = await axios.get(`${AERO_API_URL}/flights/${position.fa_flight_id}/position`, { headers });
            // Fetch Flight track
            // eslint-disable-next-line no-await-in-loop
            const flightTrackResponse = await axios.get(`${AERO_API_URL}/flights/${position.fa_flight_id}/track`, {
              headers,
            });

            const flightData = {
              ...flightResponse.data,
              ...flightTrackResponse.data,
            };

            res.write(`${JSON.stringify(flightData)}hhh`);

            // eslint-disable-next-line no-console
            console.log('flightData', position.fa_flight_id);

            allFlights.push(flightData);
          }
        }
      }
      nextUrl = links && links.next ? `${AERO_API_URL}${links.next}` : null;
    }
  }

  res.end();
  // res.status(httpStatus.OK).json({ flights: allFlights });
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
