
import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');

  const books = await collection.find({}).toArray();

  return books.map((book) => {
    return {
      id: book.id,
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate,
    };
  });
};

const getBookById = async (id) => {
  const db = getDb();
  const collection = db.collection('books');

  const book = await collection.findOne({ id });

  if (!book) {
    return null;
  }

  return {
    id: book.id,
    authorId: book.authorId,
    title: book.title,
    publicationDate: book.publicationDate,
  };
};

const createBook = async (bookData) => {
  const db = getDb();
  const collection = db.collection('books');

  await collection.createIndex({ id: 1 }, { unique: true });
  await collection.insertOne(bookData);

  return {
    id: bookData.id,
    authorId: bookData.authorId,
    title: bookData.title,
    publicationDate: bookData.publicationDate,
  };
};
  
const updateBook = async (id, bookData) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: bookData },
    { returnDocument: 'after' }
  );

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    authorId: result.authorId,
    title: result.title,
    publicationDate: result.publicationDate,
  };
};
  
const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection('books');

  const result = await collection.deleteOne({ id });

  return result.deletedCount > 0;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
