-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS book CASCADE; 

CREATE TABLE book (
book_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
publisher_id BIGINT NOT NULL,  
title TEXT NOT NULL,
released INT NOT NULL
);

DROP TABLE IF EXISTS author CASCADE;

CREATE TABLE author (
author_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name TEXT NOT NULL,
dob DATE,
pob TEXT  
);

DROP TABLE IF EXISTS authors_book;

CREATE TABLE authors_book (
book_id BIGINT REFERENCES book(book_id),
author_id BIGINT REFERENCES author(author_id)
);

DROP TABLE IF EXISTS publisher;

CREATE TABLE publisher (
publisher_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name TEXT NOT NULL,
city TEXT,
state TEXT,
country TEXT
);

DROP TABLE IF EXISTS review;

CREATE TABLE review (
review_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
reviewer_id BIGINT,
book_id BIGINT NOT NULL,
rating SMALLINT NOT NULL,
CONSTRAINT rating CHECK (rating BETWEEN 1 AND 5),
review VARCHAR (140) NOT NULL
);

DROP TABLE IF EXISTS reviewer;

CREATE TABLE reviewer (
reviewer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name TEXT NOT NULL,
company TEXT NOT NULL
);




INSERT INTO 
  author (name, dob, pob)
VALUES
  ('ryan', '4/3/1992', 'portland');

INSERT INTO
  book (publisher_id, title, released)
VALUES
  ('1', 'hi', 1922);

INSERT INTO
  reviewer (name, company)
VALUES
  ('Denzel', 'Most Books');

INSERT INTO
  publisher (name, city, state, country)
VALUES
  ('sam', 'buffalo', 'ny', 'us');

INSERT INTO
  review (rating, reviewer_id, review, book_id)
VALUES
  (1, 1, 'nice', 1);

INSERT INTO
  authors_book (author_id, book_id)
VALUES
  (1, 1)