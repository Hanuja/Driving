USE driving_school_db;

-- 19. Homepage Sections
CREATE TABLE IF NOT EXISTS homepage_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 20. About Page
CREATE TABLE IF NOT EXISTS about_page (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_title VARCHAR(255),
    hero_description TEXT,
    story_title VARCHAR(255),
    story_content TEXT,
    mission_title VARCHAR(255),
    mission_description TEXT,
    vision_title VARCHAR(255),
    vision_description TEXT,
    philosophy TEXT,
    hero_image VARCHAR(255),
    story_image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 21. About Features
CREATE TABLE IF NOT EXISTS about_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 22. About Statistics
CREATE TABLE IF NOT EXISTS about_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stat_key VARCHAR(100) NOT NULL UNIQUE,
    stat_value VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL
);

-- 23. Course Packages
CREATE TABLE IF NOT EXISTS course_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    lessons INT,
    duration VARCHAR(100),
    price DECIMAL(10, 2),
    discount DECIMAL(5, 2) DEFAULT 0.00,
    features TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 24. Course Lessons
CREATE TABLE IF NOT EXISTS course_lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    lesson_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 25. Promotions
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5, 2),
    start_date DATE,
    end_date DATE,
    image_url VARCHAR(255),
    cta_text VARCHAR(100),
    cta_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 26. Training Schedules
CREATE TABLE IF NOT EXISTS training_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    branch_id INT NOT NULL,
    instructor_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    status ENUM('AVAILABLE', 'BOOKED') DEFAULT 'AVAILABLE',
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);
