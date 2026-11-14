
import express from 'express';
import {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from './controllers/books.js';

import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books returned successfully
 *       500:
 *         description: Internal server error
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Authors returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - id
 *                   - name
 *                   - birthYear
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: a1
 *                   name:
 *                     type: string
 *                     example: Jane Austen
 *                   birthYear:
 *                     type: integer
 *                     example: 1775
 *       500:
 *         description: Internal server error
 */
router.get('/authors', getAllAuthors);


/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get one author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom author ID, such as a1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: a1
 *                 name:
 *                   type: string
 *                   example: Jane Austen
 *                 birthYear:
 *                   type: integer
 *                   example: 1775
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.get('/authors/:id', getAuthorById);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             additionalProperties: false
 *             properties:
 *               id:
 *                 type: string
 *                 example: a4
 *               name:
 *                 type: string
 *                 example: Mark Twain
 *               birthYear:
 *                 type: integer
 *                 example: 1835
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Invalid data or duplicate author ID
 *       500:
 *         description: Internal server error
 */
router.post('/authors', createAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an existing author
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom author ID, such as a4
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             additionalProperties: false
 *             properties:
 *               name:
 *                 type: string
 *                 example: Samuel Clemens
 *               birthYear:
 *                 type: integer
 *                 example: 1835
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       400:
 *         description: Invalid author data
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
router.put('/authors/:id', updateAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by ID
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom author ID, such as a4
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Author deleted successfully (no response body)
 *       404:
 *         description: Author not found
 *       409:
 *         description: Cannot delete an author who has books
 *       500:
 *         description: Internal server error
 */
router.delete('/authors/:id', deleteAuthor);

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - authorId
 *               - title
 *               - publicationDate
 *             additionalProperties: false
 *             properties:
 *               id:
 *                 type: string
 *                 example: b4
 *               authorId:
 *                 type: string
 *                 example: a4
 *               title:
 *                 type: string
 *                 example: A New Beginning
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-01-15
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid data, duplicate ID, or unknown author
 *       500:
 *         description: Internal server error
 */
router.post('/books', createBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     summary: Update an existing book
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom book ID, such as b4
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - authorId
 *               - title
 *               - publicationDate
 *             additionalProperties: false
 *             properties:
 *               authorId:
 *                 type: string
 *                 example: a5
 *               title:
 *                 type: string
 *                 example: A New Beginning - Revised
 *               publicationDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-20
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Invalid book data or unknown author
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put('/books/:id', updateBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Custom book ID, such as b4
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Book deleted successfully (no response body)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete('/books/:id', deleteBookHandler);

export default router;