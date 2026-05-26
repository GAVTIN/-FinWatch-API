const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectTestDb = async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
};

const clearTestDb = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections)
        await collections[key].deleteMany({});
};

const closeTestDb = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

module.exports = { connectTestDb, clearTestDb, closeTestDb };
