const Car = require('../models/car');
const { ObjectId } = require('mongodb');

async function getAllCars(req, res) {
    try {
        const cars = await Car.findAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cars));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function addMaintenanceRecord(req, res) {
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString();
  });
  req.on('end', async () => {
      try {
          const { serviceType, date, cost } = JSON.parse(body);
          const carId = req.url.split('/')[2];  

          if (!serviceType || !date || !cost) {
              throw new Error('Missing required fields');
          }

          const recordId = new ObjectId();
          
          const maintenanceRecord = {
              _id: recordId,
              serviceType,
              date,
              cost
          };

          const result = await Car.addMaintenanceRecord(carId, maintenanceRecord);
          
          if (result.modifiedCount > 0) {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                  message: 'Maintenance record added successfully',
                  recordId: recordId.toString()
              }));
          } else {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Car not found' }));
          }
      } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message || 'Unable to add maintenance record' }));
      }
  });
}


async function createCar(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { make, model, year, color, clientId } = JSON.parse(body); 
      if (!clientId) throw new Error('Client ID is required');
      
      const car = new Car(make, model, year, color, clientId);
      const id = await car.save();
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id, message: 'Car created successfully' }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Invalid input' }));
    }
  });
}


async function getCarById(req, res) {
    const id = req.url.split('/')[2];
    try {
        const car = await Car.findById(id);
        if (car) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(car));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Car not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

async function getCarsByClient(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { clientId } = JSON.parse(body);
      
      if (!clientId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Client ID is required' }));
        return;
      }
      
      const cars = await Car.findAll(clientId);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cars));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
}



async function getMaintenanceRecordById(req, res) {
  try {
    const carId = req.url.split('/')[2];
    const recordId = req.url.split('/')[4];

    const car = await Car.findById(carId);
    if (!car) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Car not found' }));
      return;
    }
    
    const maintenanceRecord = car.maintenanceRecords.find(record => record._id.toString() === recordId);
    
    if (maintenanceRecord) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(maintenanceRecord));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Maintenance record not found' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}



async function updateCarDetails(req, res) {
  const id = req.url.split('/')[2];
  
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const updateData = JSON.parse(body);
      const result = await Car.update(id, updateData);

      if (result.modifiedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Car updated successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car not found or not authorized to update' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Invalid input' }));
    }
  });
}


async function updateMaintenanceRecord(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      const carId = req.url.split('/')[2];
      const recordId = req.url.split('/')[4];
      const updateData = JSON.parse(body);
      
      if (Object.keys(updateData).length === 0) {
        throw new Error('No fields to update');
      }
      
      const result = await Car.updateMaintenanceRecord(carId, recordId, updateData);
      
      if (result.modifiedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Maintenance record updated successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car or maintenance record not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Unable to update maintenance record' }));
    }
  });
}



  async function updateCarColor(req, res) {
    try {
      const id = req.url.split('/')[2];
      const { color } = JSON.parse(await getRequestBody(req));
      const result = await Car.updateColor(id, color);
      if (result.modifiedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Car color updated successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid input' }));
    }
  }
  
  

async function replaceCarFeatures(req, res) {
    try {
      const id = req.url.split('/')[2];
      const newFeatures = JSON.parse(await getRequestBody(req)).features;
      const result = await Car.replaceFeatures(id, newFeatures);
      if (result.modifiedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Car features replaced successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid input' }));
    }
  }
  


  async function deleteCar(req, res) {
    const id = req.url.split('/')[2];
    
    try {
      const result = await Car.delete(id);
  
      if (result.deletedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Car deleted successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car not found or not authorized to delete' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
    }
  }
  

async function removeMaintenanceRecord(req, res) {
    try {
      const carId = req.url.split('/')[2];
      const recordId = req.url.split('/')[4];
      const result = await Car.removeMaintenanceRecord(carId, recordId);
      if (result.modifiedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Maintenance record removed successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car or maintenance record not found' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
  

module.exports = {
    getAllCars,
    getCarById,
    updateCarDetails,
    deleteCar,
    getCarsByClient,
    createCar,
    addMaintenanceRecord,
    getMaintenanceRecordById,
    updateMaintenanceRecord,
    removeMaintenanceRecord,
    replaceCarFeatures,
    updateCarColor
}