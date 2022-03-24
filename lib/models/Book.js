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
};
