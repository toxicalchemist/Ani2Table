-- Update products table to include pending and rejected statuses for approval workflow
USE ani2table;

-- Modify the status column to include new values
ALTER TABLE products 
MODIFY COLUMN status ENUM('pending', 'available', 'rejected', 'out_of_stock', 'discontinued') DEFAULT 'available';

-- Optional: Update any existing products to have a proper status
-- UPDATE products SET status = 'available' WHERE status IS NULL;

SELECT 'Products table status column updated successfully!' as message;
