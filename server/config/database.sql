-- Ani2Table Database Schema
-- Run this file to create the database structure

CREATE DATABASE IF NOT EXISTS ani2table;
USE ani2table;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  middle_name VARCHAR(50),
  birthday DATE,
  gender ENUM('male', 'female', 'other'),
  contact_number VARCHAR(20),
  user_type ENUM('consumer', 'farmer', 'admin') NOT NULL,
  address TEXT,
  profile_image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_user_type (user_type)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  farmer_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'kg',
  image_url VARCHAR(255),
  status ENUM('pending', 'available', 'rejected', 'out_of_stock', 'discontinued') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farmer_id (farmer_id),
  INDEX idx_category (category),
  INDEX idx_status (status)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  consumer_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (consumer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_consumer_id (consumer_id),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  farmer_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id),
  INDEX idx_farmer_id (farmer_id)
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  consumer_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (consumer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (consumer_id, product_id),
  INDEX idx_consumer_id (consumer_id)
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  transaction_type ENUM('payment', 'refund') DEFAULT 'payment',
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_reference VARCHAR(100),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_is_read (is_read)
);

-- Insert demo accounts (password for all: "password")
INSERT INTO users (username, password, email, first_name, last_name, middle_name, birthday, gender, contact_number, user_type) VALUES
('consumer', '$2a$10$F63QGFJGXMqqfSdEqxD1weK00ddfpVENMenYQTgILP5bDtx83fHmC', 'consumer@ani2table.com', 'Maria', 'Santos', 'Cruz', '1995-05-15', 'female', '09123456789', 'consumer'),
('farmer', '$2a$10$F63QGFJGXMqqfSdEqxD1weK00ddfpVENMenYQTgILP5bDtx83fHmC', 'farmer@ani2table.com', 'Pedro', 'Garcia', 'Reyes', '1980-03-20', 'male', '09187654321', 'farmer'),
('admin', '$2a$10$F63QGFJGXMqqfSdEqxD1weK00ddfpVENMenYQTgILP5bDtx83fHmC', 'admin@ani2table.com', 'Admin', 'User', '', '1985-01-01', 'male', '09111111111', 'admin');

-- Insert sample products (optional) - Philippine Rice Varieties
INSERT INTO products (farmer_id, name, description, category, price, quantity, unit, status) VALUES
(2, 'Sinandomeng', 'Premium Sinandomeng rice - aromatic and fluffy', 'Rice', 50.00, 100, 'kg', 'available'),
(2, 'Jasmine Rice', 'Fragrant jasmine rice - perfect for everyday meals', 'Rice', 55.00, 150, 'kg', 'available'),
(2, 'Dinorado', 'High-quality Dinorado rice - soft and delicious', 'Rice', 60.00, 120, 'kg', 'available');
