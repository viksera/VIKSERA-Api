const { MongoClient, ObjectId } = require("mongodb");
const logger = require("winston"); // Replace with your preferred logger

let db;

async function connectToDB(uri, dbName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    logger.info("Connected to MongoDB");
}

// Create a document in a collection
async function Create(collectionName, data, docId = undefined) {
    return new Promise(async (resolve, reject) => {
        try {
            const collection = db.collection(collectionName);
            if (docId !== undefined) {
                data._id = new ObjectId(docId);
                await collection.updateOne({ _id: data._id }, { $set: data }, { upsert: true });
                resolve(true);
            } else {
                const result = await collection.insertOne(data);
                resolve(result.insertedId);
            }
        } catch (error) {
            logger.error(error);
            reject(false);
        }
    });
}

// Update a document
async function Update(collectionName, data, docId) {
    return new Promise(async (resolve, reject) => {
        try {
            const collection = db.collection(collectionName);
            await collection.updateOne({ _id: new ObjectId(docId) }, { $set: data }, { upsert: true });
            resolve(true);
        } catch (error) {
            logger.error(error);
            reject(false);
        }
    });
}

// Delete a document
async function Delete(collectionName, docId) {
    return new Promise(async (resolve, reject) => {
        try {
            const collection = db.collection(collectionName);
            await collection.deleteOne({ _id: new ObjectId(docId) });
            resolve(true);
        } catch (error) {
            logger.error(error);
            reject(false);
        }
    });
}

// Read documents with optional filtering, sorting, and pagination
async function Read(collectionName, docId = undefined, filter = {}, limit = 10, sort = { index: -1 }) {
    return new Promise(async (resolve, reject) => {
        try {
            const collection = db.collection(collectionName);
            if (docId !== undefined) {
                const doc = await collection.findOne({ _id: new ObjectId(docId) });
                resolve(doc ? { ...doc, DocId: doc._id } : null);
            } else {
                const docs = await collection.find(filter).sort(sort).limit(limit).toArray();
                resolve(docs.map(doc => ({ ...doc, DocId: doc._id })));
            }
        } catch (error) {
            logger.error(error);
            reject(false);
        }
    });
}



module.exports = {
    connectToDB,
    Create,
    Update,
    Delete,
    Read
};
