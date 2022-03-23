const pool = require('../utils/pool');

module.exports = class Review {
  review_id;
  reviewer_id;
  book_id;
  rating;
  review;

  constructor(row) {
    this.review_id = row.review_id;
    this.reviewer_id = row.reviewer_id;
    this.book_id = row.book_id;
    this.rating = row.rating;
    this.review = row.review;
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
};