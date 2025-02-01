import mongoose from 'mongoose';
import DataRow from '../models/dataRows.model'; // Import the Mongoose model
import dotenv from 'dotenv';
dotenv.config();

// MongoDB URI from environment variable
const uri = String(process.env.MONGO_URI);
// console.log(uri);

// Connect to MongoDB using Mongoose
export const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process on connection failure
    }
};

// Insert data into MongoDB using Mongoose model
export const insertData = async (collectionName: string, data: any[]) => {
    try {
        if (data.length > 0) {
            // Assuming the data is to be inserted into the DataRow model, otherwise, adjust the model accordingly
            await DataRow.insertMany(data);
            console.log(
                `Inserted ${data.length} documents into the '${collectionName}' collection.`
            );
        }
    } catch (error) {
        console.error(`Error inserting data into '${collectionName}':`, error);
        throw error;
    }
};

// Retrieve all entries from the specified collection
export const getAllEntries = async (collectionName: string) => {
    try {
        const entries = await DataRow.find({});
        console.log(
            `Retrieved ${entries.length} documents from the '${collectionName}' collection.`
        );
        return entries;
    } catch (error) {
        console.error(`Error retrieving data from '${collectionName}':`, error);
        throw error;
    }
};
