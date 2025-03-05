const { ObjectId } = require('mongodb');
const { getDb } = require('../config/database');
const { model } = require('mongoose');

class Car {
    constructor(make, model, year, color) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
    }

    static async findAll() {
        const db = getDb();
        return db.collection('cars').find().toArray();
    }

    static async findById(id) {
        const db = getDb();
        return db.collection('cars').findOne({ _id: ObjectId.createFromHexString(id) });
    }

    async save() {
        const db = getDb();
        const result = await db.collection('cars').insertOne(this);
        return result.insertedId;
    }

    static async update(id, updateData) {
        const db = getDb();
        return db.collection('cars').updateOne(
            { _id: ObjectId.createFromHexString(id) },
            { $set: updateData }
        );
    }

    static async delete(id) {
        const db = getDb();
        return db.collection('cars').deleteOne({ _id: ObjectId.createFromHexString(id) });
    }

    static async addMaintenanceRecord(id, record) {
        const db = getDb();
        return db.collection('cars').updateOne(
          { _id: ObjectId.createFromHexString(id) },
          { 
            $push: { maintenanceRecords: record },
            $set: { lastUpdated: new Date() }
          }
        );
      }
    
      static async removeMaintenanceRecord(carId, recordId) {
        const db = getDb();
        return db.collection('cars').updateOne(
          { _id: ObjectId.createFromHexString(carId) },
          { 
            $pull: { maintenanceRecords: { _id: ObjectId.createFromHexString(recordId) } },
            $set: { lastUpdated: new Date() }
          }
        );
      }
}

module.exports = Car;