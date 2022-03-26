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

  async getReviews() {
    const { rows } = await pool.query(
      `
      SELECT
      review.review_id AS id,
        review.rating,
        review.review,
        review.book_id,
        book.title
    FROM
        review
    LEFT JOIN
        book
    ON
        book.book_id = review.book_id
    WHERE
        reviewer_id=$1;
      `,
      [this.reviewer_id]
    );
    this.review = rows;
    console.log('||||', rows);
    return this;
  }

  static async updateById(id, { name, company }) {
    const existingReviewer = await Reviewer.getById(id);

    if(!existingReviewer) return null;

    const newName = name ?? existingReviewer.name;
    const newCompany = company ?? existingReviewer.company;

    const { rows } = await pool.query(
      `
        UPDATE
            reviewer
        SET
            name=$2, company=$3
        WHERE 
            reviewer_id=$1
        RETURNING
            *
        `,
      [id, newName, newCompany]
    );
    if(!rows[0]) return null;
    console.log('rows[0]', rows[0]);
    return new Reviewer(rows[0]);
  }

  static async deleteById(id) {
    try {
      const { rows } = await pool.query(
        `DELETE FROM 
        reviewer 
        WHERE 
        reviewer_id=$1
        RETURNING 
        *
        `,
        [id]
      );
      // console.log('ROWROW', rows);
      if(!rows[0]) return null;
      return new Reviewer(rows[0]);
    }
    catch {
      const error = new Error('reviewer with reviews can not be deleted');
      error.status = 422;
      throw error;
    }
  }
};
