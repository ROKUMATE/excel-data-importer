import { MongoClient } from 'mongodb';

const uri = String(process.env.MONGO_URI);
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process on connection failure
    }
};

export const insertData = async (collectionName: string, data: any[]) => {
    try {
        const db = client.db('excel-project');
        const collection = db.collection(collectionName);

        // Use bulkWrite for performance with large datasets
        const operations = data.map((doc) => ({
            insertOne: { document: doc },
        }));
        const result = await collection.bulkWrite(operations);

        console.log(
            `Inserted ${result.insertedCount} documents into the '${collectionName}' collection.`
        );
    } catch (error) {
        console.error(`Error inserting data into '${collectionName}':`, error);
        throw error;
    }
};
