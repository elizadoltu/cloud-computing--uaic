const url = require('url');
const carController = require('../controller/carController');

function handleCarRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  if (trimmedPath === 'cars' && req.method === 'GET') {
    carController.getAllCars(req, res);
  } else if (trimmedPath === 'cars' && req.method === 'POST') {
    carController.createCar(req, res);
  } else if (trimmedPath.startsWith('cars/') && req.method === 'GET') {
    carController.getCarById(req, res);
  } else if (trimmedPath.startsWith('cars/') && req.method === 'PUT') {
    carController.updateCar(req, res);
  } else if (trimmedPath.startsWith('cars/') && req.method === 'DELETE') {
    carController.deleteCar(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

module.exports = handleCarRoutes;
