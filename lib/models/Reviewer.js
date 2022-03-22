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
                reviewer (name, company)
            VALUES
                ($1, $2)
            RETURNING 
                *
            `,
      [name, company]
    );
    return new Reviewer(rows[0]);
  }
};
