-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS book; 

CREATE TABLE book (
book_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
publisher_id BIGINT NOT NULL,  
title TEXT NOT NULL,
released INT NOT NULL
);

DROP TABLE IF EXISTS author;

CREATE TABLE author (
author_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name TEXT NOT NULL,
dob DATE,
pob TEXT  
);

DROP TABLE IF EXISTS authors_book;

CREATE TABLE authors_book (
book_id BIGINT,
author_id BIGINT
FOREIGN KEY (book_id) REFERENCES book (book_id)
FOREIGN KEY (author_id) REFERENCES author (author_id)

);




