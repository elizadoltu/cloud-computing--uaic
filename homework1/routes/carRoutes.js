const url = require('url');
const carController = require('../controller/carController');

function handleCarRoutes(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const pathSegments = trimmedPath.split('/');

  if (trimmedPath === 'cars' && req.method === 'GET') {
    const urlParts = url.parse(req.url, true);
    const queryParams = urlParts.query;
    req.clientId = queryParams.clientId;
    carController.getCarsByClient(req, res);
} else if (trimmedPath === 'cars' && req.method === 'POST') {
    carController.createCar(req, res);
}
 else if (pathSegments[0] === 'cars' && pathSegments.length === 2) {
    const carId = pathSegments[1];
    if (req.method === 'GET') {
      carController.getCarsByClient(req, res);
    } else if (req.method === 'PUT') {
      carController.updateCarDetails(req, res);
    } else if (req.method === 'DELETE') {
      carController.deleteCar(req, res);
    }
  } else if (pathSegments[0] === 'cars' && pathSegments.length === 3) {
    const carId = pathSegments[1];
    const action = pathSegments[2];
    if (action === 'maintenance' && req.method === 'POST') {
      carController.addMaintenanceRecord(req, res);
    } else if (action === 'features' && req.method === 'PUT') {
      carController.replaceCarFeatures(req, res);
    } else if (action === 'color' && req.method === 'PATCH') {
      carController.updateCarColor(req, res);
    } else if (action === 'mileage' && req.method === 'PATCH') {
      carController.updateCarMileage(req, res);
    }
  } else if (pathSegments[0] === 'cars' && pathSegments.length === 4 && pathSegments[2] === 'maintenance') {
    const carId = pathSegments[1];
    const recordId = pathSegments[3];
    if (req.method === 'DELETE') {
      carController.removeMaintenanceRecord(req, res);
    } else if (req.method === 'GET') {
      carController.getMaintenanceRecordById(req, res);
    } else if (req.method === 'PATCH') {
      carController.updateMaintenanceRecord(req, res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

module.exports = handleCarRoutes;
