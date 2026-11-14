
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../models/books.js';
import { getDb } from '../db/connect.js';

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await getBookById(id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body ?? {};

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof authorId !== 'string' ||
      !authorId.trim() ||
      typeof title !== 'string' ||
      !title.trim() ||
      typeof publicationDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate) ||
      Object.keys(req.body ?? {}).some((field) => {
        return !['id', 'authorId', 'title', 'publicationDate'].includes(field);
      })
    ) {
      return res.status(400).json({ error: 'Invalid book data' });
    }

    const db = getDb();
    const author = await db.collection('authors').findOne({
      id: authorId.trim(),
    });

    if (!author) {
      return res.status(400).json({
        error: 'Author ID does not match an existing author',
      });
    }

    const book = await createBook({
      id: id.trim(),
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate,
    });

    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Book ID already exists',
      });
    }

    console.error('Error creating book:', error);
    return res.status(500).json({
      error: 'Unable to create book',
    });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body ?? {};

    if (
      typeof authorId !== 'string' ||
      !authorId.trim() ||
      typeof title !== 'string' ||
      !title.trim() ||
      typeof publicationDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate) ||
      Object.keys(req.body ?? {}).some((field) => {
        return !['authorId', 'title', 'publicationDate'].includes(field);
      })
    ) {
      return res.status(400).json({ error: 'Invalid book data' });
    }

    const db = getDb();
    const author = await db.collection('authors').findOne({
      id: authorId.trim(),
    });

    if (!author) {
      return res.status(400).json({
        error: 'Author ID does not match an existing author',
      });
    }

    const book = await updateBook(id, {
      authorId: authorId.trim(),
      title: title.trim(),
      publicationDate,
    });

    if (!book) {
      return res.status(404).json({
        error: 'Book not found',
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({
      error: 'Unable to update book',
    });
  }
};
  
const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteBook(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Book not found',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({
      error: 'Unable to delete book',
    });
  }
};

export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };
