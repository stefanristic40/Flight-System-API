const express = require('express');
const aeroController = require('../../controllers/aero.controller');

const router = express.Router();

// router.use('/flights/search', aeroController.searchFlights);
router.use('/flights/search/positions', aeroController.searchFlightsPositions);
router.use('/flights/search/positions_by_timestamps', aeroController.searchFlightsPositionsByTimestamps);
router.use(`/flights/:id/track`, aeroController.getFlightTrack);

module.exports = router;
