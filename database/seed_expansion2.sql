USE driving_school_db;

INSERT INTO vehicle_categories (name, description, icon, display_order) VALUES 
('Light Vehicles', 'Cars - Manual & Automatic. Beginner Friendly.', 'Car', 1),
('Motorcycles', 'Motorcycles - Beginner & Advanced. Safety Training.', 'Bike', 2),
('Heavy Vehicles', 'Trucks - Heavy Vehicle Training. Professional Training.', 'Truck', 3),
('Commercial Vehicles', 'Vans / Commercial - Professional Training.', 'Van', 4);

INSERT INTO pricing (course_id, package_name, lessons, regular_price, discount_price, is_popular, features) VALUES 
(1, 'STARTER', 5, 15000, 12500, FALSE, '5 Driving Lessons, Vehicle Included, Instructor Included, Basic Road Training'),
(1, 'STANDARD', 10, 30000, 25000, TRUE, '10 Driving Lessons, Vehicle Included, Parking Practice, Road Training, Traffic Training, Test Preparation'),
(1, 'PREMIUM', 20, 55000, 48000, FALSE, '20 Driving Lessons, Vehicle Included, Advanced Road Training, Parking, Mock Test, Test Preparation, Extra Instructor Support');

INSERT INTO gallery_categories (name, slug) VALUES 
('Training', 'training'),
('Vehicles', 'vehicles'),
('Students', 'students'),
('Instructors', 'instructors'),
('Branches', 'branches'),
('Events', 'events'),
('Success Stories', 'success');

INSERT INTO legal_documents (type, title, content) VALUES 
('privacy_policy', 'Privacy Policy', '<h1>Privacy Policy</h1><p>Your privacy and security are important to us. This policy outlines how we collect and use your data.</p><h2>1. Information We Collect</h2><p>We collect your name, phone number, email, and booking information.</p><h2>2. How We Use Information</h2><p>To process lesson bookings and respond to inquiries.</p>'),
('terms_conditions', 'Terms & Conditions', '<h1>Terms & Conditions</h1><p>Please review the terms governing the use of our website and driving training services.</p><h2>1. General Terms</h2><p>Website usage and service information rules apply.</p><h2>2. Course Enrollment</h2><p>Rules for registering for courses.</p>');

INSERT INTO contact_info (school_phone, whatsapp_number, email, address, google_maps_url, monday_hours, tuesday_hours, facebook_url) VALUES 
('+94 77 123 4567', '+94 77 123 4567', 'info@drivepro.lk', '123 Galle Road, Colombo 03, Sri Lanka', 'https://maps.google.com/?q=Colombo', '8:00 AM – 6:00 PM', '8:00 AM – 6:00 PM', 'https://facebook.com/drivepro');
