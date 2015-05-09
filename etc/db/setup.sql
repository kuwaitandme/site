CREATE ROLE kuwaitandme;
ALTER ROLE kuwaitandme with password 'asd';
ALTER ROLE kuwaitandme WITH LOGIN;

REVOKE CONNECT ON DATABASE kuwaitandme FROM PUBLIC;
GRANT CONNECT ON DATABASE kuwaitandme TO kuwaitandme;

CREATE USER webmaster PASSWORD 'kuwaitandme';
GRANT ALL ON DATABASE kuwaitandme TO webmaster;
GRANT ALL ON ALL TABLES IN DATABASE kuwaitandme TO kuwaitandme;


ALTER ROLE kuwaitandme with password NULL;
psql -U kuwaitandme -d kuwaitandme -h 127.0.0.1 -W