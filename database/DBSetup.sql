CREATE DATABASE QuizDB;

USE QuizDB;

CREATE TABLE users (
	uid INT(10) unsigned NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
	userpass VARCHAR(255) NOT NULL,
    questions INT(8) DEFAULT 0,
    correct INT(8) DEFAULT 0,
    deleted_flag TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (uid)
);