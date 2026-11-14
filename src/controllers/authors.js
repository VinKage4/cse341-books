
import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('Error retrieving authors:', error);
    return res.status(500).json({ error: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Error retrieving author:', error);
    return res.status(500).json({ error: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body ?? {};

    if (
      typeof id !== 'string' ||
      !id.trim() ||
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear < 1000 ||
      birthYear > new Date().getFullYear() ||
      Object.keys(req.body ?? {}).some(
        (field) => {
  return !['id', 'name', 'birthYear'].includes(field);
}
      )
    ) {
      return res.status(400).json({ error: 'Invalid author data' });
    }

    const author = await createAuthorInDb({
      id: id.trim(),
      name: name.trim(),
      birthYear,
    });

    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Author ID already exists' });
    }

    console.error('Error creating author:', error);
    return res.status(500).json({ error: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthYear } = req.body ?? {};

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isInteger(birthYear) ||
      birthYear < 1000 ||
      birthYear > new Date().getFullYear() ||
      Object.keys(req.body ?? {}).some(
        (field) => {
  return !['name', 'birthYear'].includes(field);
}
      )
    ) {
      return res.status(400).json({ error: 'Invalid author data' });
    }

    const author = await updateAuthorInDb(id, {
      name: name.trim(),
      birthYear,
    });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Error updating author:', error);
    return res.status(500).json({ error: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAuthorFromDb(id);

    if (result === 'not_found') {
      return res.status(404).json({
        error: 'Author not found',
      });
    }

    if (result === 'has_books') {
      return res.status(409).json({
        error: 'Cannot delete author because books reference this author',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting author:', error);
    return res.status(500).json({
      error: 'Unable to delete author.',
    });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
