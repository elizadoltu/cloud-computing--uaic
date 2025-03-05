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

module.exports = {
    getAllCars,
    getCarById,
    updateCar,
    deleteCar,
    createCar
}