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

-- Step 4: Add missing `inventory_adjusted` column to `orders` (safe default 0)
-- This column is used by the backend to avoid adjusting inventory multiple times
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS inventory_adjusted TINYINT(1) DEFAULT 0;

-- Step 5: Add missing `is_low_stock` column to `products` (safe default 0)
-- The backend sets this flag when product quantity falls below threshold
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_low_stock TINYINT(1) DEFAULT 0;

-- Step 6: Verify the new columns
SELECT 'Orders table updated successfully!' as message;
SELECT id, status, inventory_adjusted FROM orders LIMIT 10;
SELECT id, name, quantity, is_low_stock FROM products LIMIT 10;
