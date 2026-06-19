CREATE DATABASE insurance_db;

USE insurance_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100),
    password VARCHAR(100)
);

INSERT INTO users(email,password)
VALUES('admin@insurance.com','admin123');

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    policy_type VARCHAR(100)
);

CREATE TABLE policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_name VARCHAR(100),
    premium DECIMAL(10,2),
    status VARCHAR(50)
);

CREATE TABLE claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(100),
    policy_number VARCHAR(100),
    status VARCHAR(50)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(100),
    amount DECIMAL(10,2),
    status VARCHAR(50)
);
