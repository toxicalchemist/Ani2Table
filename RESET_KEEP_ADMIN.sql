-- RESET_KEEP_ADMIN.sql
-- Wipes all data except admin users. Run carefully.
-- Usage (from Windows Powershell/CMD):
-- mysql -u root -p ani2table < "C:\Users\Alex Brecia\Ani2Table\RESET_KEEP_ADMIN.sql"

USE ani2table;

-- Temporarily disable foreign key checks so we can delete/alter tables safely
SET FOREIGN_KEY_CHECKS = 0;

-- 1) Clear child/detail tables
DELETE FROM order_items;
ALTER TABLE order_items AUTO_INCREMENT = 1;

DELETE FROM transactions;
ALTER TABLE transactions AUTO_INCREMENT = 1;

DELETE FROM cart;
ALTER TABLE cart AUTO_INCREMENT = 1;

DELETE FROM messages;
ALTER TABLE messages AUTO_INCREMENT = 1;

DELETE FROM orders;
ALTER TABLE orders AUTO_INCREMENT = 1;

DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;

-- 2) Remove all non-admin users
DELETE FROM users WHERE user_type != 'admin';

-- 3) Ensure at least one admin exists. If no admin user is present, insert a default admin
-- Password for the default admin is the bcrypt hash of "password" used elsewhere in this project.
INSERT INTO users (username, password, email, first_name, last_name, user_type, created_at, updated_at)
SELECT 'admin', '$2a$10$F63QGFJGXMqqfSdEqxD1weK00ddfpVENMenYQTgILP5bDtx83fHmC', 'admin@ani2table.com', 'Admin', 'User', 'admin', NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE user_type = 'admin');

-- 4) (Optional) Reset users AUTO_INCREMENT to max(id)+1 to keep increments tidy
-- Note: this is safe because we've ensured at least one admin exists
SET @maxid = (SELECT IFNULL(MAX(id),0) FROM users);
SET @next = @maxid + 1;
SET @sql = CONCAT('ALTER TABLE users AUTO_INCREMENT = ', @next);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'RESET_COMPLETE' AS message;
