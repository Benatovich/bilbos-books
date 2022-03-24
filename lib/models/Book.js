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
            book.title,
            book.released,
            publisher.publisher_id,
            publisher.name,
            author.author_id,
            author.name,
            review.review_id,
            review.rating,
            review.review,
            reviewer.reviewer_id,
            reviewer.name
          FROM
            book
        LEFT JOIN
            authors_book
        ON
            book.book_id = authors_book.book_id
        LEFT JOIN
            author
        ON
            authors_book.author_id = author.author_id
        LEFT JOIN
            publisher
        ON
            publisher.publisher_id = book.publisher_id
        LEFT JOIN
            review
        ON
            book.book_id = review.book_id
        LEFT JOIN
            reviewer
        ON
            review.reviewer_id = reviewer.reviewer_id
        WHERE
            book.book_id=$1
          `,
      [id]
    );
    if (!rows[0]) return null;
    return new Book(rows[0]);
  }


};
