import { MongoClient } from 'mongodb';

const uri = String(process.env.MONGO_URI);
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};

export const insertData = async (collectionName: string, data: any[]) => {
    const db = client.db('excel-project');
    const collection = db.collection(collectionName);
    await collection.insertMany(data);
};
