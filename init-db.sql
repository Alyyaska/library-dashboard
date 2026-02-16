\encoding UTF8
SET client_encoding = 'UTF8';

DROP DATABASE IF EXISTS library_dashboard;
CREATE DATABASE library_dashboard;

\c library_dashboard;

DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  birth_date DATE,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  country VARCHAR(80) NOT NULL,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
  title VARCHAR(250) NOT NULL,
  published_on DATE,
  pages INTEGER NOT NULL CHECK (pages > 0),
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

INSERT INTO authors (full_name, birth_date, rating, country)
VALUES
('Лев Толстой', '1828-09-09', 4.90, 'Russia'),
('Фёдор Достоевский', '1821-11-11', 4.80, 'Russia'),
('Ernest Hemingway', '1899-07-21', 4.20, 'USA'),
('Haruki Murakami', '1949-01-12', 4.10, 'Japan');

INSERT INTO books (author_id, title, published_on, pages, price)
VALUES
(1, 'Война и мир', '1869-01-01', 1225, 19.99),
(1, 'Анна Каренина', '1877-01-01', 864, 14.50),
(2, 'Преступление и наказание', '1866-01-01', 671, 12.00),
(3, 'The Old Man and the Sea', '1952-09-01', 127, 7.99);
