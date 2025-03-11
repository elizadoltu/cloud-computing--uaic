const Car = require('../models/car');

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

            const result = await Car.addMaintenanceRecord(carId, { serviceType, date, cost });
            
            if (result.modifiedCount > 0) {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Maintenance record added successfully' }));
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
            const { make, model, year, color } = JSON.parse(body);
            const car = new Car(make, model, year, color);
            const id = await car.save();
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id, message: 'Car created successfully' }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid input' }));
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
    
    const maintenanceRecord = car.maintenanceRecords.find(record => record.id === recordId);
    
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


async function updateCar(req, res) {
    const id = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async() => {
        try {
            const updateData = JSON.parse(body);
            const result = await Car.update(id, updateData);
            if (result.modifiedCount > 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Car updated successfully' }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Car not found' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid inoput' }));
        }
    });
}

async function updateCarMileage(req, res) {
    try {
      const id = req.url.split('/')[2];
      const { mileage } = JSON.parse(await getRequestBody(req));
      const result = await Car.updateMileage(id, mileage);
      if (result.modifiedCount > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Car mileage updated successfully' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Car not found' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid input' }));
    }
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
            res.end(JSON.stringify({ error: 'Cat not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
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
    updateCar,
    deleteCar,
    createCar,
    addMaintenanceRecord,
    getMaintenanceRecordById,
    updateCarMileage,
    removeMaintenanceRecord,
    replaceCarFeatures,
    updateCarColor
}