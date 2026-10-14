<?php
require_once __DIR__ . '/AuthController.php';

class ReportController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function handleRequest($method, $action, $input) {
        AuthController::requireAuth();

        if ($method === 'GET') {
            if ($action === 'dashboard') {
                $this->getDashboardStats();
            } else if ($action === 'bookings') {
                $this->getBookingsReport();
            } else if ($action === 'revenue') {
                $this->getRevenueReport();
            } else {
                jsonResponse(false, 'Invalid endpoint', null, 404);
            }
        } else {
            jsonResponse(false, 'Method not allowed', null, 405);
        }
    }

    private function getDashboardStats() {
        try {
            $stats = [];
            
            // Total Students
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM students");
            $stats['total_students'] = $stmt->fetchColumn();

            // Total Bookings
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM bookings");
            $stats['total_bookings'] = $stmt->fetchColumn();

            // Pending Bookings
            $stmt = $this->conn->query("SELECT COUNT(*) as total FROM bookings WHERE status = 'Pending'");
            $stats['pending_bookings'] = $stmt->fetchColumn();

            // Total Revenue
            $stmt = $this->conn->query("SELECT SUM(paid_amount) as total FROM students");
            $stats['total_revenue'] = $stmt->fetchColumn() ?? 0;

            jsonResponse(true, 'Stats retrieved', $stats);
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function getBookingsReport() {
        try {
            $query = "SELECT b.id, b.date, b.time_slot, b.status, s.name as student_name, c.name as course_name
                      FROM bookings b
                      JOIN students s ON b.student_id = s.id
                      JOIN courses c ON b.course_id = c.id
                      ORDER BY b.date DESC, b.time_slot ASC";
            $stmt = $this->conn->query($query);
            $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, 'Bookings report retrieved', $bookings);
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }

    private function getRevenueReport() {
        try {
            $query = "SELECT DATE(registration_date) as date, SUM(paid_amount) as daily_revenue, COUNT(*) as new_students
                      FROM students
                      WHERE paid_amount > 0
                      GROUP BY DATE(registration_date)
                      ORDER BY DATE(registration_date) DESC
                      LIMIT 30";
            $stmt = $this->conn->query($query);
            $revenue = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(true, 'Revenue report retrieved', $revenue);
        } catch (PDOException $e) {
            jsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
        }
    }
}
?>
