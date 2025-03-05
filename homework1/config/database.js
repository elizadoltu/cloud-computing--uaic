const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.DATABASE_URI;
const dbName = 'cars';

async function connectToDatabase() {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
}

function getDb() {
    return db;
}

module.exports = { connectToDatabase, getDb };