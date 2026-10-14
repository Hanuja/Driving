<?php
// 1. Headers for CORS and JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Global JSON Response Helper
function jsonResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// 3. Database Class
class Database
{
    private $host = "127.0.0.1";
    private $port = "3307";
    private $db_name = "driving_school_db";
    private $username = "root";
    private $password = "";

    public $conn;

    public function getConnection()
    {
        $this->conn = null;
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO(
                $dsn,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            jsonResponse(false, 'Database connection failed', null, 500);
        }
        return $this->conn;
    }
}

// 4. API Routing Logic
session_start();
require_once 'controllers/AuthController.php';

$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';
$uri = explode('/', $endpoint);

$resource = $uri[0] ?? '';
$action = $uri[1] ?? '';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true) ?? [];

// Route to the appropriate controller
if ($resource === 'auth') {
    $controller = new AuthController();
    $controller->handleRequest($method, $action, $input);
} 
else if ($resource === 'courses') {
    require_once 'controllers/CourseController.php';
    $controller = new CourseController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'vehicles') {
    require_once 'controllers/VehicleController.php';
    $controller = new VehicleController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'instructors') {
    require_once 'controllers/InstructorController.php';
    $controller = new InstructorController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'bookings') {
    require_once 'controllers/BookingController.php';
    $controller = new BookingController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'admins') {
    require_once 'controllers/AdminController.php';
    $controller = new AdminController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'students') {
    require_once 'controllers/StudentController.php';
    $controller = new StudentController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'migrate_db') {
    require_once 'controllers/MigrateController.php';
    $controller = new MigrateController();
    $controller->handleRequest();
}
else if ($resource === 'migrate_instructors') {
    require_once 'controllers/MigrateInstructorController.php';
    $controller = new MigrateInstructorController();
    $controller->handleRequest();
}
else if ($resource === 'migrate_vehicles') {
    require_once 'controllers/MigrateVehicleController.php';
    $controller = new MigrateVehicleController();
    $controller->handleRequest();
}else if ($resource === 'branches') {
    require_once 'controllers/BranchController.php';
    $controller = new BranchController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'schema') {
    require_once 'controllers/SchemaController.php';
    $controller = new SchemaController();
    $controller->handleRequest();
}
else if ($resource === 'pricing') {
    require_once 'controllers/PricingController.php';
    $controller = new PricingController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'testimonials') {
    require_once 'controllers/TestimonialController.php';
    $controller = new TestimonialController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'gallery') {
    require_once 'controllers/GalleryController.php';
    $controller = new GalleryController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'faqs') {
    require_once 'controllers/FaqController.php';
    $controller = new FaqController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'contact-messages') {
    require_once 'controllers/ContactMessageController.php';
    $controller = new ContactMessageController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'content') {
    require_once 'controllers/ContentController.php';
    $controller = new ContentController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'reports') {
    require_once 'controllers/ReportController.php';
    $controller = new ReportController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'notifications') {
    require_once 'controllers/NotificationController.php';
    $controller = new NotificationController();
    $controller->handleRequest($method, $action, $input);
}
else if ($resource === 'settings') {
    require_once 'controllers/SettingsController.php';
    $controller = new SettingsController();
    $controller->handleRequest($method, $action, $input);
}
else {
    jsonResponse(false, 'Endpoint not found', null, 404);
}
?>
