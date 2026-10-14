<?php
$host = "127.0.0.1";
$port = "3307";
$db_name = "driving_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host={$host};port={$port};dbname={$db_name}", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 1. Add categories
    $cats = [
        ['name' => 'Training Sessions', 'sort_order' => 1],
        ['name' => 'Our Vehicles', 'sort_order' => 2],
        ['name' => 'Successful Students', 'sort_order' => 3],
        ['name' => 'Instructors', 'sort_order' => 4],
    ];
    
    $catIds = [];
    foreach ($cats as $cat) {
        $stmt = $conn->prepare("INSERT IGNORE INTO gallery_categories (name, sort_order) VALUES (:name, :sort_order)");
        $stmt->execute([':name' => $cat['name'], ':sort_order' => $cat['sort_order']]);
        
        $stmt = $conn->prepare("SELECT id FROM gallery_categories WHERE name = :name");
        $stmt->execute([':name' => $cat['name']]);
        $catIds[$cat['name']] = $stmt->fetchColumn();
    }
    
    // 2. Add some gallery items
    $items = [
        [
            'title' => 'Student Practice Session',
            'category_id' => $catIds['Training Sessions'],
            'description' => 'A student practicing reverse parking with our instructor.',
            'image_url' => 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
            'sort_order' => 1,
            'status' => 'active'
        ],
        [
            'title' => 'New Training Car',
            'category_id' => $catIds['Our Vehicles'],
            'description' => 'Brand new Toyota Aqua added to our automatic training fleet.',
            'image_url' => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
            'sort_order' => 2,
            'status' => 'active'
        ],
        [
            'title' => 'License Obtained!',
            'category_id' => $catIds['Successful Students'],
            'description' => 'Another happy student successfully passing their practical test.',
            'image_url' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
            'sort_order' => 3,
            'status' => 'active'
        ],
        [
            'title' => 'Expert Instructors',
            'category_id' => $catIds['Instructors'],
            'description' => 'Our highly qualified instructors ready for the day.',
            'image_url' => 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop',
            'sort_order' => 4,
            'status' => 'active'
        ],
        [
            'title' => 'Heavy Vehicle Training',
            'category_id' => $catIds['Our Vehicles'],
            'description' => 'Bus training session for heavy vehicle license.',
            'image_url' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5f5a?q=80&w=800&auto=format&fit=crop',
            'sort_order' => 5,
            'status' => 'active'
        ],
        [
            'title' => 'Classroom Theory',
            'category_id' => $catIds['Training Sessions'],
            'description' => 'Students attending the mandatory theory session.',
            'image_url' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
            'sort_order' => 6,
            'status' => 'active'
        ]
    ];
    
    // Clear existing for clean slate (optional, but good for testing)
    $conn->query("TRUNCATE TABLE gallery");
    
    foreach ($items as $item) {
        $stmt = $conn->prepare("INSERT INTO gallery (title, category_id, description, image_url, sort_order, status) VALUES (:title, :category_id, :description, :image_url, :sort_order, :status)");
        $stmt->execute($item);
    }
    
    echo "Gallery populated with sample data successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
