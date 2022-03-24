const pool = require('../utils/pool');

module.exports = class Reviewer {
  reviewer_id;
  name;
  company;

  constructor(row) {
    this.reviewer_id = row.reviewer_id;
    this.name = row.name;
    this.company = row.company;
  }

  static async insert({ name, company }) {
    const { rows } = await pool.query(
      `
            INSERT INTO
                reviewer(name, company)
            VALUES
                ($1, $2)
            RETURNING 
                *
            `,
      [name, company]
    );

    return new Reviewer(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
          SELECT 
            *
          FROM
            reviewer
          `
    );
    return rows.map((row) => new Reviewer(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT
        reviewer.reviewer_id,
        reviewer.name,
        reviewer.company,
        review.review_id,
        review.rating,
        review.review,
        book.book_id,
        book.title
      FROM
        reviewer
      LEFT JOIN
        review
      ON
        review.reviewer_id = reviewer.reviewer_id
      LEFT JOIN
        book
      ON
        review.book_id = book.book_id
      WHERE
        reviewer.reviewer_id=$1
      `,
      [id]
    );
    if (!rows[0]) return null;
    return new Reviewer(rows[0]);
  }
};
