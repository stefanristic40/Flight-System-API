const express = require('express');
const aeroRoute = require('./aero.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/aero',
    route: aeroRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
