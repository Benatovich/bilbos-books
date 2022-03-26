const pool = require('../utils/pool');

module.exports = class Book {
  book_id;
  title;
  released;
  publisher_id;

  constructor(row) {
    this.book_id = row.book_id;
    this.title = row.title;
    this.released = row.released;
    this.publisher_id = row.publisher_id;
  }

  static async insert({ title, released, publisher_id }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
            book(title, released, publisher_id)
        VALUES
            ($1, $2, $3)
        RETURNING
            *
      `,
      [title, released, publisher_id]
    );

    return new Book(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
          SELECT
            *
          FROM
            book
          `
    );

    return rows.map((row) => new Book(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        book.book_id,
        book.title,
        book.released,
        publisher.publisher_id,
        publisher.name,
        review.review_id,
        review.rating,
        review.review,
        reviewer.reviewer_id,
        reviewer.name
      FROM
        book
      LEFT JOIN
        review
      ON
        book.book_id = review.book_id
      LEFT JOIN
        reviewer
      ON
        review.reviewer_id = reviewer.reviewer_id
      LEFT JOIN
        publisher
      ON
        book.publisher_id = publisher.publisher_id
      WHERE
        book.book_id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Book(rows[0]);
  }

  async getAuthors() {
    const { rows } = await pool.query(
      `
      SELECT
        author.author_id,
        author.name
      FROM
        author
      LEFT JOIN
        authors_book
      ON
        author.author_id = authors_book.author_id
      WHERE
        authors_book.book_id=$1
      `,
      [this.book_id]
    );

    this.author = rows;
    return this;
  }

  async getReviews() {
    const { rows } = await pool.query(
      `
      SELECT
        review.review_id AS id,
        review.rating,
        review.review,
        reviewer.reviewer_id,
        reviewer.name
      FROM
        book
      LEFT JOIN
        review
      ON
        book.book_id = review.book_id
      LEFT JOIN
        reviewer
      ON
        review.reviewer_id = reviewer.reviewer_id
      WHERE
        review.book_id=$1
      `,
      [this.book_id]
    );

    this.reviews = rows;
    return this;
  }
};
