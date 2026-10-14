USE driving_school_db;

INSERT INTO homepage_sections (section_name, display_order) VALUES 
('Hero', 1), ('QuickBooking', 2), ('WhyChooseUs', 3), ('FeaturedCourses', 4), ('Statistics', 5), 
('VehicleShowcase', 6), ('HowItWorks', 7), ('Instructors', 8), ('LearnerGuidance', 9), 
('TrialLesson', 10), ('SuccessStories', 11), ('Promotion', 12), ('Gallery', 13), ('FAQ', 14);

INSERT INTO about_page (hero_title, hero_description, story_title, story_content, mission_title, mission_description, vision_title, vision_description, philosophy) VALUES
('ABOUT OUR DRIVING SCHOOL', 'Building confident, responsible and safe drivers for Sri Lanka.', 'Our Story', 'Our driving school was established with a simple goal — to help learners become confident, responsible and safety-conscious drivers.', 'OUR MISSION', 'To provide safe, professional and accessible driving education that prepares learners for real-world road conditions.', 'OUR VISION', 'To become one of Sri Lanka''s most trusted driving education providers.', '1. Understand \n2. Practice \n3. Experience \n4. Prepare \n5. Drive Confidently');

INSERT INTO about_features (icon, title, description, display_order) VALUES
('User', 'Experienced Instructors', 'Qualified and patient instructors focused on learner confidence.', 1),
('Car', 'Modern Training Vehicles', 'Well-maintained vehicles suitable for practical training.', 2),
('Shield', 'Safety First', 'Road safety is incorporated into every lesson.', 3),
('Calendar', 'Flexible Training', 'Training schedules designed around learner availability.', 4);

INSERT INTO about_statistics (stat_key, stat_value, label) VALUES
('students_trained', '5,000+', 'STUDENTS TRAINED'),
('pass_rate', '95%', 'PASS RATE'),
('years_experience', '10+', 'YEARS EXPERIENCE'),
('instructor_count', '15+', 'PROFESSIONAL INSTRUCTORS');

INSERT INTO course_packages (course_id, package_name, lessons, duration, price, features, is_popular) VALUES
(1, 'STARTER', 5, '1 Week', 12500, 'Basic Vehicle Control, Road Introduction, Instructor Support', 0),
(1, 'STANDARD', 10, '3 Weeks', 25000, 'Road Training, Parking Practice, Traffic Training, Test Preparation', 1),
(1, 'PREMIUM', 20, '1 Month', 48000, 'Advanced Road Training, Parking, Traffic, Mock Test, Driving Test Preparation', 0);

INSERT INTO course_lessons (course_id, lesson_number, title, description) VALUES
(1, 1, 'Vehicle Familiarization', 'Controls, seating, mirrors and safety.'),
(1, 2, 'Starting & Stopping', 'Smooth acceleration and braking.'),
(1, 3, 'Steering & Turning', 'Cornering and road positioning.'),
(1, 4, 'Gear & Clutch Control', 'Manual vehicle control.'),
(1, 5, 'Traffic Training', 'Real-world road conditions.');
