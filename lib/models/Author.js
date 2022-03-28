const pool = require('../utils/pool');

module.exports = class Author {
  author_id;
  name;
  dob;
  pob;

  constructor(row) {
    this.author_id = row.author_id;
    this.name = row.name;
    this.dob = new Date(row.dob).toLocaleDateString('en-US');
    this.pob = row.pob;
  }

  static async insert({ name, dob, pob }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        author (name, dob, pob)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      `,
      [name, dob, pob]
    );

    return new Author(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT
        *
      FROM
        author
      `
    );

    return rows.map((row) => new Author(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        author.author_id,
        author.name,
        author.dob,
        author.pob,
        book.book_id,
        book.title,
        book.released
      FROM
        author
      LEFT JOIN
        authors_book
      ON
        authors_book.author_id = author.author_id
      LEFT JOIN
        book
      ON
        book.book_id = authors_book.book_id
      WHERE
        author.author_id=$1
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Author(rows[0]);
  }

  async getBooks() {
    const { rows } = await pool.query(
      `
      SELECT
        book.book_id AS id,
        book.title,
        book.released
      FROM
        book
      LEFT JOIN
        authors_book
      ON
        authors_book.book_id = book.book_id
      WHERE
        authors_book.author_id=$1
      `,
      [this.author_id]
    );

    this.book = rows;
    return this;
  }
};
