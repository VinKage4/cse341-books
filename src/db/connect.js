
import { MongoClient } from 'mongodb';

let database;

export const connectToDb = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing');
  }

  const client = new MongoClient(uri);
  await client.connect();

  database = client.db(process.env.MONGODB_DB_NAME || 'practice');
  console.log('Connected to MongoDB');
};

export const getDb = () => {
  if (!database) {
    throw new Error('Database connection not initialized');
  }

  return database;
};
