-- Create a user 'kuwaitandme_db' with password 'password'
CREATE ROLE kuwaitandme_db;
ALTER ROLE kuwaitandme_db with password 'password';
ALTER ROLE kuwaitandme_db WITH LOGIN;

-- Create a database 'kuwaitandme' and give access only to user 'kuwaitandme_db'
CREATE DATABASE kuwaitandme;
REVOKE CONNECT ON DATABASE kuwaitandme FROM PUBLIC;
GRANT CONNECT ON DATABASE kuwaitandme TO kuwaitandme_db;
GRANT ALL ON DATABASE kuwaitandme TO webmaster;
GRANT ALL ON ALL TABLES IN DATABASE kuwaitandme TO kuwaitandme;
