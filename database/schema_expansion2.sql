USE driving_school_db;

-- 27. Vehicle Categories
CREATE TABLE IF NOT EXISTS vehicle_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0
);

-- 28. Pricing Configuration
CREATE TABLE IF NOT EXISTS pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    lessons INT,
    regular_price DECIMAL(10,2),
    discount_price DECIMAL(10,2),
    is_popular BOOLEAN DEFAULT FALSE,
    features TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 29. Gallery Categories
CREATE TABLE IF NOT EXISTS gallery_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- 30. Legal Documents
CREATE TABLE IF NOT EXISTS legal_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('privacy_policy', 'terms_conditions') NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 31. Contact Information
CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_phone VARCHAR(50),
    whatsapp_number VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    google_maps_url TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    monday_hours VARCHAR(100),
    tuesday_hours VARCHAR(100),
    wednesday_hours VARCHAR(100),
    thursday_hours VARCHAR(100),
    friday_hours VARCHAR(100),
    saturday_hours VARCHAR(100),
    sunday_hours VARCHAR(100),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    youtube_url VARCHAR(255)
);
