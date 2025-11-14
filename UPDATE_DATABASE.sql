-- SQL script to update products table to support product approval workflow
-- Run this in phpMyAdmin or MySQL Workbench

USE ani2table;

-- Step 1: Modify the products table status column to include pending and rejected
ALTER TABLE products 
MODIFY COLUMN status ENUM('pending', 'available', 'rejected', 'out_of_stock', 'discontinued') DEFAULT 'available';

-- Step 2: (Optional) Update existing products to pending status for testing
-- Uncomment the line below if you want to set some products to pending for testing
-- UPDATE products SET status = 'pending' WHERE id IN (1, 2, 3);

-- Step 3: Verify the changes
SELECT 'Products table updated successfully!' as message;
SELECT id, name, status FROM products;
