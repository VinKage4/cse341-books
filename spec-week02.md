# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- Status code: `200`
- Response body: an array of book objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:

- Status code: `200`
- Response body: the matching book object

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:

- Status code: `201`
- Response body: the newly created book object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:

- Status code: `200`
- Response body: the updated book object

Errors:

- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal

Create an authors collection that stores information about book authors. Implement all CRUD operations for authors and document every route in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: integer, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books

Each author can have multiple books.

Books reference authors using the `authorId` field.

When deleting an author, the API must check whether any books reference that author's `id`.

If books still reference the author, the API must reject the deletion with status `409 Conflict`.

This prevents books from referencing authors that no longer exist.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- Status code: `200`
- Response body: an array of author objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return an author by custom id.

Success:

- Status code: `200`
- Response body: the matching author object

Errors:

- `404` if the author does not exist
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

```json
{
  "id": "a1",
  "name": "George Orwell",
  "birthYear": 1903
}
```

Success:

- Status code: `201`
- Response body: the newly created author object

Errors:

- `400` if a required field is missing or invalid
- `400` if the author id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

```json
{
  "name": "George Orwell",
  "birthYear": 1903
}
```

Success:

- Status code: `200`
- Response body: the updated author object

Errors:

- `400` if a required field is missing or invalid
- `404` if the author does not exist
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an author by custom id.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if the author does not exist
- `409` if the author still has books referencing their id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route, including request bodies, response schemas, examples, and error status codes.

### Deployment Expectations

After implementation, the author routes must work locally and on Render. All author endpoints must be testable through `/api-docs`.

---

# Books API Week 02 Spec - Version 2

## AI Evaluation Summary

The Version 1 specification was reviewed for bugs, security, efficiency, and unclear requirements.

### Improvements

- Add unique indexes for custom book and author IDs.
- Validate all required fields and their data types.
- Use consistent JSON error responses.
- Prevent changing IDs during updates.
- Prevent deleting authors who still have books.
- Migrate existing book records to use `authorId`.
- Add database indexes to improve lookup performance.
- Document all routes, request bodies, responses, and errors in Swagger.

## Feature 1: Book CRUD Operations and Author References

### Goal

Extend the existing Books API to support full CRUD operations, establish author relationships, and provide complete Swagger documentation.

### Data Model

Collection: `books`

Required fields:

- `id`: nonempty string, unique, such as `b1`
- `authorId`: nonempty string referencing an existing author's custom `id`
- `title`: nonempty string
- `publicationDate`: string in `YYYY-MM-DD` format representing a valid calendar date

MongoDB automatically creates `_id`, but API routes use the custom `id`.

Create a unique index on `books.id` and an index on `books.authorId`.

Existing Week 01 books must be updated to replace their author-name field with a valid `authorId`. Create the corresponding author records before migrating the books.

### Validation Rules

- All required fields must be present and correctly typed.
- String fields cannot be empty or contain only whitespace.
- `publicationDate` must be a valid calendar date in `YYYY-MM-DD` format.
- The submitted `authorId` must reference an existing author.
- Book IDs must be unique.
- Book IDs cannot be changed after creation.
- POST accepts exactly `id`, `authorId`, `title`, and `publicationDate`.
- PUT requires all three editable fields: `authorId`, `title`, and `publicationDate`.
- PUT does not accept an `id` field.

### Routes

#### GET /books

Returns all books.

Success:

- `200 OK`: Array of book objects.
- Return `[]` when the collection is empty.

Errors:

- `500 Internal Server Error`: Unexpected database error.

#### GET /books/:id

Returns one book by custom ID.

Success:

- `200 OK`: Matching book object.

Errors:

- `404 Not Found`: Book does not exist.
- `500 Internal Server Error`: Unexpected error.

#### POST /books

Creates a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:

- `201 Created`: Returns the newly created book object.

Errors:

- `400 Bad Request`: Missing or invalid fields.
- `400 Bad Request`: Duplicate book ID.
- `400 Bad Request`: Referenced author does not exist.
- `500 Internal Server Error`: Unexpected error.

#### PUT /books/:id

Updates an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:

- `200 OK`: Returns the updated book object.

Errors:

- `400 Bad Request`: Missing or invalid fields.
- `400 Bad Request`: Author does not exist.
- `404 Not Found`: Book does not exist.
- `500 Internal Server Error`: Unexpected error.

The book ID remains unchanged.

#### DELETE /books/:id

Deletes an existing book.

Success:

- `204 No Content`: No response body.

Errors:

- `404 Not Found`: Book does not exist.
- `500 Internal Server Error`: Unexpected error.

### Response Format

Successful GET, POST, and PUT operations return book objects without MongoDB's internal `_id` field.

Example:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Errors return a JSON object containing an `error` field.

Example:

```json
{
  "error": "Author not found"
}
```

Unexpected errors must not expose database connection strings, stack traces, or internal implementation details.

### Swagger Documentation

Document all five book routes, including:

- Path parameters
- Request body schemas
- Required fields
- Response schemas and examples
- HTTP status codes
- Error responses

All routes must be testable through `/api-docs`.

---

## Feature 2: Author CRUD Operations

### Goal

Implement full CRUD operations for authors and maintain valid relationships between authors and books.

### Data Model

Collection: `authors`

Required fields:

- `id`: nonempty unique string, such as `a1`
- `name`: nonempty string
- `birthYear`: integer between 1000 and the current calendar year

MongoDB automatically creates `_id`, but API routes use the custom `id`.

Create a unique index on `authors.id`.

### Validation Rules

- All required fields must be present.
- IDs and names must be nonempty strings.
- `birthYear` must be an integer in the allowed range.
- Author IDs must be unique.
- Author IDs cannot be changed after creation.
- POST accepts `id`, `name`, and `birthYear`.
- PUT requires `name` and `birthYear` and does not accept `id`.

### Routes

#### GET /authors

Returns all authors.

Success:

- `200 OK`: Array of author objects.
- Return `[]` when the collection is empty.

Errors:

- `500 Internal Server Error`: Unexpected error.

#### GET /authors/:id

Returns one author by custom ID.

Success:

- `200 OK`: Matching author object.

Errors:

- `404 Not Found`: Author does not exist.
- `500 Internal Server Error`: Unexpected error.

#### POST /authors

Creates an author.

Request body:

```json
{
  "id": "a1",
  "name": "George Orwell",
  "birthYear": 1903
}
```

Success:

- `201 Created`: Returns the created author object.

Errors:

- `400 Bad Request`: Missing or invalid fields.
- `400 Bad Request`: Duplicate author ID.
- `500 Internal Server Error`: Unexpected error.

#### PUT /authors/:id

Updates an existing author.

Request body:

```json
{
  "name": "George Orwell",
  "birthYear": 1903
}
```

Success:

- `200 OK`: Returns the updated author object.

Errors:

- `400 Bad Request`: Missing or invalid fields.
- `404 Not Found`: Author does not exist.
- `500 Internal Server Error`: Unexpected error.

The author ID remains unchanged.

#### DELETE /authors/:id

Deletes an author only when no books reference the author.

Success:

- `204 No Content`: Author deleted; no response body.

Errors:

- `404 Not Found`: Author does not exist.
- `409 Conflict`: One or more books reference this author.
- `500 Internal Server Error`: Unexpected error.

Before deleting an author, query the `books` collection for documents whose `authorId` matches the author ID.

If matching books exist, reject the deletion.

### Response Format

Successful GET, POST, and PUT operations return author objects without MongoDB's internal `_id` field.

Example:

```json
{
  "id": "a1",
  "name": "George Orwell",
  "birthYear": 1903
}
```

Error example:

```json
{
  "error": "Cannot delete author because books reference this author"
}
```

### Swagger Documentation

Document all five author routes, including:

- Path parameters
- Request body schemas
- Required fields
- Response schemas and examples
- HTTP status codes
- Error responses

All author routes must be testable through `/api-docs`.

---

## Security and Reliability

- Validate all incoming request bodies before database operations.
- Use exact allowed fields to prevent unintended database updates.
- Keep MongoDB credentials in environment variables.
- Never expose credentials or internal database errors in API responses.
- Use unique indexes to enforce ID uniqueness.
- Use database lookups to validate author references.
- Do not expose MongoDB `_id` values in API responses.
- For this course project, write routes are publicly accessible. Authentication and authorization would be required before deploying a production API.
- Author deletion and book creation must be coordinated to avoid orphaned references. For this assignment, recheck references before deletion; production systems would require stronger concurrency safeguards.

## Testing Plan

Test all routes locally through Swagger.

Verify:

1. GET returns all records or an empty array.
2. GET by ID returns an existing record.
3. GET by nonexistent ID returns `404`.
4. POST creates valid books and authors.
5. POST rejects duplicate IDs.
6. POST rejects missing or invalid fields.
7. POST books rejects nonexistent author IDs.
8. PUT updates valid records.
9. PUT rejects invalid fields and author references.
10. PUT with nonexistent ID returns `404`.
11. DELETE removes an existing book.
12. DELETE removes an author without books.
13. DELETE rejects an author referenced by books with `409`.
14. DELETE with nonexistent ID returns `404`.
15. Successful DELETE returns `204` with no body.
16. All ten routes appear in Swagger and work on Render.

## Deployment Expectations

The API must work locally and on Render.

Swagger must be accessible at `/api-docs`.

Verify that all ten book and author endpoints work correctly after deployment.
