CREATE TABLE greetings (
  id SERIAL PRIMARY KEY,
  message TEXT
);

INSERT INTO greetings (message) VALUES
('Hello, World!'),
('Welcome to my API!');

