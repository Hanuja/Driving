-- ==============================================================
-- ADMIN REGISTRATION & LOGIN SQL QUERIES
-- ==============================================================

-- 1. Admin Registration (Insert new admin)
-- NOTE: In a real application, you should never insert plain text passwords. 
-- The password_hash should be generated using PHP's password_hash() function (bcrypt).
-- Example for password 'admin123': $2y$10$YourGeneratedHashHere...
INSERT INTO admins (name, email, password_hash) 
VALUES (
    'New Admin Name', 
    'newadmin@ceylondrive.lk', 
    '$2y$10$3XjXp1pT16/h0Qx3v3B./eO316M.6mI.j02t8M1r.Z/e0J0k8aF2W' -- This hash is for 'password123'
);

-- 2. Admin Login (Check credentials)
-- In PHP, you would fetch the user by email, and then use password_verify() 
-- to check if the entered password matches the stored password_hash.
SELECT id, name, email, password_hash, created_at 
FROM admins 
WHERE email = 'newadmin@ceylondrive.lk' 
LIMIT 1;

-- ==============================================================
-- DOCUMENT FILES TABLE (If you needed a table to store documents)
-- ==============================================================

-- Create a table for storing uploaded document files
CREATE TABLE IF NOT EXISTS document_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Insert a new document file record
INSERT INTO document_files (admin_id, file_name, file_path, file_type, file_size)
VALUES (
    1, -- The ID of the admin who uploaded it
    'driving_manual.pdf', 
    '/uploads/documents/driving_manual.pdf', 
    'application/pdf', 
    204800 -- Size in bytes
);
