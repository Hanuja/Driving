<?php
class VehicleController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        // All endpoints except GET require authentication
        if ($method !== 'GET') {
            $this->auth->requireAuth();
        } else {
            // Optional: If you want GET to be protected, uncomment below:
            // $this->auth->requireAuth();
        }

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getVehicle($action);
                } else {
                    $this->getAllVehicles();
                }
                break;
            case 'POST':
                $this->createVehicle($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateVehicle($action, $input);
                } else {
                    jsonResponse(false, "Vehicle ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteVehicle($action);
                } else {
                    jsonResponse(false, "Vehicle ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllVehicles() {
        try {
            $query = "SELECT v.*, 
                        b.name as branch_name,
                        i.name as instructor_name
                      FROM vehicles v
                      LEFT JOIN branches b ON v.branch_id = b.id
                      LEFT JOIN instructors i ON v.instructor_id = i.id
                      ORDER BY v.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResponse(true, "Vehicles retrieved successfully", $vehicles);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve vehicles: " . $e->getMessage(), null, 500);
        }
    }

    private function getVehicle($id) {
        try {
            $query = "SELECT v.*, 
                        b.name as branch_name, b.address as branch_address, b.phone as branch_phone,
                        i.name as instructor_name, i.instructor_code, i.phone as instructor_phone
                      FROM vehicles v
                      LEFT JOIN branches b ON v.branch_id = b.id
                      LEFT JOIN instructors i ON v.instructor_id = i.id
                      WHERE v.id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute([':id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Fetch Booking History
                $bStmt = $this->conn->prepare("SELECT bk.booking_id, s.name as student_name, i.name as instructor_name, c.name as course_name, bk.booking_date, bk.start_time, bk.end_time, bk.status
                                               FROM bookings bk
                                               LEFT JOIN students s ON bk.student_id = s.id
                                               LEFT JOIN instructors i ON bk.instructor_id = i.id
                                               LEFT JOIN courses c ON bk.course_id = c.id
                                               WHERE bk.vehicle_id = :id ORDER BY bk.booking_date DESC, bk.start_time DESC LIMIT 50");
                $bStmt->execute([':id' => $id]);
                $vehicle['booking_history'] = $bStmt->fetchAll(PDO::FETCH_ASSOC);

                jsonResponse(true, "Vehicle retrieved successfully", $vehicle);
            } else {
                jsonResponse(false, "Vehicle not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve vehicle: " . $e->getMessage(), null, 500);
        }
    }

    private function createVehicle($input) {
        if (empty($input['vehicle_number']) || empty($input['registration_number']) || empty($input['brand']) || empty($input['model']) || empty($input['vehicle_type']) || empty($input['transmission']) || empty($input['branch_id'])) {
            jsonResponse(false, "Missing required fields", null, 422);
            return;
        }

        try {
            // Check unique constraints
            $check = $this->conn->prepare("SELECT id FROM vehicles WHERE vehicle_number = :vnum OR registration_number = :rnum");
            $check->execute([
                ':vnum' => $input['vehicle_number'],
                ':rnum' => $input['registration_number']
            ]);
            
            if ($check->rowCount() > 0) {
                jsonResponse(false, "Vehicle Number or Registration Number already exists.", null, 409);
                return;
            }

            // Check if instructor is already assigned to another vehicle
            if (!empty($input['instructor_id'])) {
                $instCheck = $this->conn->prepare("SELECT id FROM vehicles WHERE instructor_id = :iid AND status != 'Inactive'");
                $instCheck->execute([':iid' => $input['instructor_id']]);
                if ($instCheck->rowCount() > 0) {
                    jsonResponse(false, "This instructor is currently assigned to another vehicle.", null, 409);
                    return;
                }
            }

            $query = "INSERT INTO vehicles (vehicle_number, registration_number, brand, model, vehicle_type, manufacturing_year, color, transmission, fuel_type, engine_capacity, mileage, license_category, branch_id, instructor_id, last_service_date, next_service_date, insurance_provider, insurance_policy_number, insurance_expiry, revenue_license_number, revenue_license_expiry, image, status) 
                      VALUES (:vnum, :rnum, :brand, :model, :vtype, :year, :color, :trans, :fuel, :eng, :mileage, :lic, :branch, :inst, :lsd, :nsd, :insp, :insn, :inse, :rln, :rle, :img, :status)";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->execute([
                ':vnum' => $input['vehicle_number'],
                ':rnum' => $input['registration_number'],
                ':brand' => $input['brand'],
                ':model' => $input['model'],
                ':vtype' => $input['vehicle_type'],
                ':year' => $input['manufacturing_year'] ?? 0,
                ':color' => $input['color'] ?? '',
                ':trans' => $input['transmission'],
                ':fuel' => $input['fuel_type'] ?? '',
                ':eng' => $input['engine_capacity'] ?? '',
                ':mileage' => $input['mileage'] ?? 0,
                ':lic' => $input['license_category'] ?? '',
                ':branch' => $input['branch_id'],
                ':inst' => $input['instructor_id'] ?? null,
                ':lsd' => $input['last_service_date'] ?? null,
                ':nsd' => $input['next_service_date'] ?? null,
                ':insp' => $input['insurance_provider'] ?? null,
                ':insn' => $input['insurance_policy_number'] ?? null,
                ':inse' => $input['insurance_expiry'] ?? null,
                ':rln' => $input['revenue_license_number'] ?? null,
                ':rle' => $input['revenue_license_expiry'] ?? null,
                ':img' => $input['image'] ?? null,
                ':status' => $input['status'] ?? 'Available'
            ]);

            $newVehicleId = $this->conn->lastInsertId();

            // Sync Instructors Table
            if (!empty($input['instructor_id'])) {
                $this->conn->prepare("UPDATE instructors SET vehicle_id = ? WHERE id = ?")->execute([$newVehicleId, $input['instructor_id']]);
            }

            jsonResponse(true, "Vehicle created successfully", ["id" => $newVehicleId]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create vehicle: " . $e->getMessage(), null, 500);
        }
    }

    private function updateVehicle($id, $input) {
        try {
            // Check unique constraints
            $check = $this->conn->prepare("SELECT id FROM vehicles WHERE (vehicle_number = :vnum OR registration_number = :rnum) AND id != :id");
            $check->execute([
                ':vnum' => $input['vehicle_number'] ?? '',
                ':rnum' => $input['registration_number'] ?? '',
                ':id' => $id
            ]);
            
            if ($check->rowCount() > 0) {
                jsonResponse(false, "Vehicle Number or Registration Number already in use.", null, 409);
                return;
            }

            if (!empty($input['instructor_id'])) {
                $instCheck = $this->conn->prepare("SELECT id FROM vehicles WHERE instructor_id = :iid AND status != 'Inactive' AND id != :id");
                $instCheck->execute([':iid' => $input['instructor_id'], ':id' => $id]);
                if ($instCheck->rowCount() > 0) {
                    jsonResponse(false, "This instructor is currently assigned to another vehicle.", null, 409);
                    return;
                }
            }

            // Sync Logic: Get old instructor
            $oldInstStmt = $this->conn->prepare("SELECT instructor_id FROM vehicles WHERE id = ?");
            $oldInstStmt->execute([$id]);
            $oldInstructor = $oldInstStmt->fetchColumn();

            $fields = [];
            $params = [':id' => $id];

            $allowed = [
                'vehicle_number', 'registration_number', 'brand', 'model', 'vehicle_type', 'manufacturing_year', 'color', 
                'transmission', 'fuel_type', 'engine_capacity', 'mileage', 'license_category', 'branch_id', 'instructor_id', 
                'last_service_date', 'next_service_date', 'insurance_provider', 'insurance_policy_number', 'insurance_expiry', 
                'revenue_license_number', 'revenue_license_expiry', 'image', 'status'
            ];

            foreach ($allowed as $field) {
                if (array_key_exists($field, $input)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field] === '' ? null : $input[$field];
                }
            }

            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }

            $query = "UPDATE vehicles SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);

            // Sync logic execute
            if (array_key_exists('instructor_id', $input)) {
                $newInstructor = $input['instructor_id'] === '' ? null : $input['instructor_id'];
                if ($oldInstructor != $newInstructor) {
                    if ($oldInstructor) {
                        $this->conn->prepare("UPDATE instructors SET vehicle_id = NULL WHERE id = ?")->execute([$oldInstructor]);
                    }
                    if ($newInstructor) {
                        $this->conn->prepare("UPDATE instructors SET vehicle_id = ? WHERE id = ?")->execute([$id, $newInstructor]);
                    }
                }
            }

            jsonResponse(true, "Vehicle updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update vehicle: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteVehicle($id) {
        try {
            // Check active bookings
            $checkBook = $this->conn->prepare("SELECT COUNT(*) FROM bookings WHERE vehicle_id = :id AND status IN ('Pending', 'Confirmed')");
            $checkBook->execute([':id' => $id]);
            if ($checkBook->fetchColumn() > 0) {
                jsonResponse(false, "This vehicle cannot be deleted because it has active bookings. Set the vehicle to Maintenance or Inactive instead.", null, 409);
                return;
            }

            // Sync instructors: remove vehicle_id from assigned instructor
            $this->conn->prepare("UPDATE instructors SET vehicle_id = NULL WHERE vehicle_id = ?")->execute([$id]);

            $stmt = $this->conn->prepare("DELETE FROM vehicles WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Vehicle deleted successfully");
            } else {
                jsonResponse(false, "Vehicle not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete vehicle: " . $e->getMessage(), null, 500);
        }
    }
}
?>
