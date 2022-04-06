const pool = require('../utils/pool');

module.exports = class Review {
  review_id;
  reviewer_id;
  book_id;
  rating;
  review;
  title;

  constructor(row) {
    this.review_id = row.review_id;
    this.reviewer_id = row.reviewer_id;
    this.book_id = row.book_id;
    this.rating = row.rating;
    this.review = row.review;
    this.title = row.title;
  }

  static async insert({ reviewer_id, book_id, rating, review }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        review (reviewer_id, book_id, rating, review)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        *
        `,
      [reviewer_id, book_id, rating, review]
    );

    return new Review(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT 
      review.review_id,
        review.rating,
        review.review,
        review.book_id,
        book.title
    FROM 
        review
    LEFT JOIN
      book
    ON
      review.book_id = book.book_id      ORDER BY 
        rating DESC
      LIMIT
        100
      `
    );

    return rows.map((row) => new Review(row));
  }

  static async deleteReview(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM 
        review
      WHERE
        review_id=$1
      RETURNING
        *
      `,
      [id]
    );

    if (!rows[0]) return null;
    return new Review(rows[0]);
  }
};
