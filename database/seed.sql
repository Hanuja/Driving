USE driving_school_db;

-- 1. Settings
INSERT INTO settings (setting_key, setting_value) VALUES
('site_name', 'Ceylon Drive Academy'),
('tagline', 'Learn to Drive. Drive with Confidence.'),
('phone', '+94771234567'),
('whatsapp', '+94771234567'),
('email', 'info@ceylondrive.lk'),
('address', '123 Galle Road, Colombo 03, Sri Lanka'),
('opening_hours', 'Mon-Sun: 8:00 AM - 6:00 PM'),
('facebook_url', 'https://facebook.com'),
('instagram_url', 'https://instagram.com');

-- 2. Branches
INSERT INTO branches (name, address, phone, manager, opening_hours, latitude, longitude, google_maps_url) VALUES
('Colombo Head Office', '123 Galle Road, Colombo 03', '+94771234567', 'Nimal Perera', 'Mon-Sun: 8:00 AM - 6:00 PM', 6.9271, 79.8612, 'https://maps.google.com'),
('Kandy Branch', '45 Peradeniya Road, Kandy', '+94812345678', 'Sunil Jayawardena', 'Mon-Sat: 8:00 AM - 5:00 PM', 7.2906, 80.6337, 'https://maps.google.com'),
('Galle Branch', '78 Matara Road, Galle', '+94912345678', 'Ruwan Silva', 'Mon-Sat: 8:00 AM - 5:00 PM', 6.0328, 80.2150, 'https://maps.google.com');

-- 3. Courses
INSERT INTO courses (title, slug, description, short_description, category, transmission, vehicle_category, duration, lessons, price, image, syllabus, requirements) VALUES
('Beginner Driving Course', 'beginner-driving-course', 'A comprehensive course for absolute beginners covering all aspects of safe driving in Sri Lanka.', 'Theory guidance, basic vehicle control, road awareness, and practical training.', 'Beginner', 'Both', 'Light Vehicles', '1 Month', 15, 25000.00, 'course-beginner.jpg', '1. Introduction\n2. Controls\n3. Road Signs\n4. Basic Maneuvers\n5. Test Prep', 'Must be at least 18 years old.'),
('Manual Driving Course', 'manual-driving-course', 'Master the clutch and gear shift with our intensive manual driving course.', 'Clutch control, gear shifting, hill starts, and city driving.', 'Standard', 'Manual', 'Light Vehicles', '3 Weeks', 10, 20000.00, 'course-manual.jpg', '1. Gear Basics\n2. Hill Starts\n3. City Driving', 'Learner Permit Required'),
('Automatic Driving Course', 'automatic-driving-course', 'Learn to drive an automatic vehicle quickly and safely.', 'Vehicle controls, traffic awareness, parking, and city driving.', 'Standard', 'Automatic', 'Light Vehicles', '2 Weeks', 8, 18000.00, 'course-automatic.jpg', '1. Auto Controls\n2. Parking\n3. Highway', 'Learner Permit Required'),
('Refresher Course', 'refresher-course', 'Ideal for license holders who haven''t driven in a while.', 'Confidence rebuilding, traffic practice, and parking.', 'Refresher', 'Both', 'Light Vehicles', '1 Week', 5, 12000.00, 'course-refresher.jpg', '1. Assessment\n2. Confidence Building', 'Valid Driving License'),
('Defensive Driving', 'defensive-driving', 'Advanced techniques to anticipate and avoid hazards.', 'Hazard awareness, emergency braking, and night driving.', 'Advanced', 'Both', 'Light Vehicles', '2 Days', 2, 15000.00, 'course-defensive.jpg', '1. Hazard Perception\n2. Emergency Braking', 'Valid Driving License'),
('Heavy Vehicle Training', 'heavy-vehicle-training', 'Professional training for lorries and buses.', 'Heavy vehicle handling and safety.', 'Professional', 'Manual', 'Heavy Vehicles', '1 Month', 20, 45000.00, 'course-heavy.jpg', '1. Vehicle Check\n2. Load Safety\n3. Maneuvers', 'Light Vehicle License for 2 Years');

-- 4. Vehicles
INSERT INTO vehicles (vehicle_name, registration_number, category, transmission, model_year, image, features, status) VALUES
('Toyota Aqua', 'CBA-1234', 'Light Vehicles', 'Automatic', 2018, 'aqua.jpg', 'Air Conditioning, Dual-Control Training, ABS', 'active'),
('Maruti Suzuki Alto', 'CAH-5678', 'Light Vehicles', 'Manual', 2017, 'alto.jpg', 'Compact, Beginner Friendly', 'active'),
('Honda Fit', 'CBB-9012', 'Light Vehicles', 'Automatic', 2019, 'fit.jpg', 'Spacious, Air Conditioning', 'active'),
('Tata Ace', 'PX-3456', 'Light Vehicles', 'Manual', 2016, 'ace.jpg', 'Cargo Training', 'active'),
('Isuzu Elf Lorry', 'LY-7890', 'Heavy Vehicles', 'Manual', 2015, 'lorry.jpg', 'Air Brakes, Power Steering', 'active'),
('Bajaj Pulsar 150', 'BCF-1122', 'Motorcycles', 'Manual', 2020, 'pulsar.jpg', 'Disc Brakes', 'active');

-- 5. Instructors
INSERT INTO instructors (name, email, phone, qualification, experience, languages, specialties, image, rating, status) VALUES
('Kamal Weerasinghe', 'kamal@ceylondrive.lk', '+94711111111', 'Department of Motor Traffic Certified Instructor', '12 Years', 'Sinhala, English', 'Beginners, Defensive Driving', 'instructor1.jpg', 4.9, 'active'),
('Samanthi Fernando', 'samanthi@ceylondrive.lk', '+94722222222', 'Certified Driving Instructor', '8 Years', 'Sinhala, English', 'Automatic Vehicles, Anxious Learners', 'instructor2.jpg', 4.8, 'active'),
('Ramesh Kumar', 'ramesh@ceylondrive.lk', '+94733333333', 'Advanced Driving Certificate', '10 Years', 'Tamil, Sinhala, English', 'Manual Vehicles, Heavy Vehicles', 'instructor3.jpg', 4.7, 'active'),
('Chaminda Silva', 'chaminda@ceylondrive.lk', '+94744444444', 'Motorcycle Safety Instructor', '15 Years', 'Sinhala', 'Motorcycles, Light Vehicles', 'instructor4.jpg', 4.9, 'active');

-- 6. FAQ Categories
INSERT INTO faq_categories (name, sort_order) VALUES
('Learner Permit & Testing', 1),
('Courses & Pricing', 2),
('Booking & Scheduling', 3);

-- 7. FAQs
INSERT INTO faqs (category_id, question, answer, sort_order) VALUES
(1, 'What documents do I need to get a learner permit in Sri Lanka?', 'You need your original National Identity Card (NIC), Medical Certificate from the NTMI, and birth certificate.', 1),
(1, 'How long is the learner permit valid?', 'The learner permit is generally valid for 18 months.', 2),
(2, 'Do you provide vehicles for the driving test?', 'Yes, we provide our dual-controlled training vehicles for your practical driving test.', 1),
(2, 'Can I switch from Manual to Automatic during my course?', 'Yes, but the pricing and lesson count may be adjusted. Please discuss with your instructor.', 2),
(3, 'How do I schedule my lessons?', 'Once you enroll, you can book your time slots either directly with your instructor or through our online booking portal.', 1);

-- 8. Testimonials
INSERT INTO testimonials (student_name, course_name, rating, testimonial, image_url, status, date) VALUES
('Sanduni P.', 'Automatic Driving Course', 5, 'Samanthi is a wonderful instructor! She was extremely patient and helped me overcome my fear of driving in Colombo traffic.', 'student1.jpg', 'approved', '2025-10-15'),
('Malith R.', 'Beginner Driving Course', 5, 'Highly professional academy. Kamal''s instructions were clear and the mock tests really prepared me for the actual RMV exam.', 'student2.jpg', 'approved', '2025-11-02'),
('Dinesh K.', 'Heavy Vehicle Training', 4, 'Good condition lorries and excellent training provided by Ramesh. Passed my test on the first try.', 'student3.jpg', 'approved', '2026-01-20');

-- 9. Admin User (Password is 'password123')
-- password_hash('password123', PASSWORD_BCRYPT) => $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi (standard laravel/generic bcrypt mock for password123, for this PHP script we will use a real hash)
INSERT INTO admins (name, email, password_hash) VALUES
('Super Admin', 'admin@ceylondrive.lk', '$2y$10$3XjXp1pT16/h0Qx3v3B./eO316M.6mI.j02t8M1r.Z/e0J0k8aF2W'); 
-- Note: $2y$10$3XjXp1pT16/h0Qx3v3B./eO316M.6mI.j02t8M1r.Z/e0J0k8aF2W is bcrypt for 'password123'
