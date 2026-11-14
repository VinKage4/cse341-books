
import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

return authors.map(({ id, name, birthYear }) => {
  return {
    id,
    name,
    birthYear,
  };
});
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id });

  if (!author) {
    return null;
  }

  return {
    id: author.id,
    name: author.name,
    birthYear: author.birthYear,
  };
};

const createAuthor = async (authorData) => {
  const db = getDb();
  const collection = db.collection('authors');

  await collection.createIndex({ id: 1 }, { unique: true });

  await collection.insertOne(authorData);

  return {
    id: authorData.id,
    name: authorData.name,
    birthYear: authorData.birthYear,
  };
};

const updateAuthor = async (id, authorData) => {
  const db = getDb();
  const collection = db.collection('authors');

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: authorData },
    { returnDocument: 'after' }
  );

  if (!result) {
    return null;
  }

  return {
    id: result.id,
    name: result.name,
    birthYear: result.birthYear,
  };
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const authorsCollection = db.collection('authors');
  const booksCollection = db.collection('books');

  // Check whether the author exists.
  const author = await authorsCollection.findOne({ id });

  if (!author) {
    return 'not_found';
  }

  // Prevent deleting authors who have books.
  const book = await booksCollection.findOne({ authorId: id });

  if (book) {
    return 'has_books';
  }

  const result = await authorsCollection.deleteOne({ id });

  if (result.deletedCount === 0) {
    return 'not_found';
  }

  return 'deleted';
};
  
export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
