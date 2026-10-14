<?php
class BranchController {
    private $conn;
    private $auth;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->auth = new AuthController();
    }

    public function handleRequest($method, $action, $input) {
        $this->auth->requireAuth();

        switch ($method) {
            case 'GET':
                if ($action) {
                    $this->getBranch($action);
                } else {
                    $this->getAllBranches();
                }
                break;
            case 'POST':
                $this->createBranch($input);
                break;
            case 'PUT':
                if ($action) {
                    $this->updateBranch($action, $input);
                } else {
                    jsonResponse(false, "Branch ID required", null, 400);
                }
                break;
            case 'DELETE':
                if ($action) {
                    $this->deleteBranch($action);
                } else {
                    jsonResponse(false, "Branch ID required", null, 400);
                }
                break;
            default:
                jsonResponse(false, "Method not allowed", null, 405);
                break;
        }
    }

    private function getAllBranches() {
        try {
            $query = "SELECT b.*, 
                      (SELECT COUNT(*) FROM instructors i WHERE i.branch_id = b.id) as instructor_count,
                      (SELECT COUNT(*) FROM vehicles v WHERE v.branch_id = b.id) as vehicle_count
                      FROM branches b ORDER BY b.id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $branches = $stmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResponse(true, "Branches retrieved successfully", $branches);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve branches: " . $e->getMessage(), null, 500);
        }
    }

    private function getBranch($id) {
        try {
            $query = "SELECT b.*,
                        (SELECT COUNT(*) FROM instructors i WHERE i.branch_id = b.id) as total_instructors,
                        (SELECT COUNT(*) FROM vehicles v WHERE v.branch_id = b.id) as total_vehicles,
                        (SELECT COUNT(*) FROM students s WHERE s.branch_id = b.id) as total_students
                      FROM branches b WHERE b.id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $branch = $stmt->fetch(PDO::FETCH_ASSOC);

                // Fetch resources explicitly to show in profile
                $instStmt = $this->conn->prepare("SELECT id, name, specialties as specialization, status FROM instructors WHERE branch_id = :id");
                $instStmt->execute([':id' => $id]);
                $branch['instructors'] = $instStmt->fetchAll(PDO::FETCH_ASSOC);

                $vehStmt = $this->conn->prepare("SELECT id, plate_number as vehicle_number, model, transmission, status FROM vehicles WHERE branch_id = :id");
                $vehStmt->execute([':id' => $id]);
                $branch['vehicles'] = $vehStmt->fetchAll(PDO::FETCH_ASSOC);

                $stuStmt = $this->conn->prepare("SELECT s.id, s.name, c.name as course, s.status FROM students s LEFT JOIN courses c ON s.course_id = c.id WHERE s.branch_id = :id");
                $stuStmt->execute([':id' => $id]);
                $branch['students'] = $stuStmt->fetchAll(PDO::FETCH_ASSOC);

                jsonResponse(true, "Branch retrieved successfully", $branch);
            } else {
                jsonResponse(false, "Branch not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to retrieve branch: " . $e->getMessage(), null, 500);
        }
    }

    private function createBranch($input) {
        if (empty($input['name']) || empty($input['branch_code'])) {
            jsonResponse(false, "Branch Name and Branch Code are required", null, 422);
            return;
        }

        try {
            $check = $this->conn->prepare("SELECT id FROM branches WHERE branch_code = :code");
            $check->execute([':code' => $input['branch_code']]);
            if ($check->rowCount() > 0) {
                jsonResponse(false, "A branch with this code already exists.", null, 409);
                return;
            }

            $query = "INSERT INTO branches (name, branch_code, description, address, city, district, postal_code, email, phone, alternative_phone, manager, opening_time, closing_time, latitude, longitude, google_maps_url, image_url, status) 
                      VALUES (:name, :branch_code, :description, :address, :city, :district, :postal_code, :email, :phone, :alternative_phone, :manager, :opening_time, :closing_time, :latitude, :longitude, :google_maps_url, :image_url, :status)";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->execute([
                ':name' => $input['name'],
                ':branch_code' => $input['branch_code'],
                ':description' => $input['description'] ?? null,
                ':address' => $input['address'] ?? null,
                ':city' => $input['city'] ?? null,
                ':district' => $input['district'] ?? null,
                ':postal_code' => $input['postal_code'] ?? null,
                ':email' => $input['email'] ?? null,
                ':phone' => $input['phone'] ?? null,
                ':alternative_phone' => $input['alternative_phone'] ?? null,
                ':manager' => $input['manager'] ?? null,
                ':opening_time' => (!empty($input['opening_time'])) ? $input['opening_time'] : null,
                ':closing_time' => (!empty($input['closing_time'])) ? $input['closing_time'] : null,
                ':latitude' => $input['latitude'] ?? null,
                ':longitude' => $input['longitude'] ?? null,
                ':google_maps_url' => $input['google_maps_url'] ?? null,
                ':image_url' => $input['image_url'] ?? null,
                ':status' => $input['status'] ?? 'Active'
            ]);

            jsonResponse(true, "Branch created successfully", ["id" => $this->conn->lastInsertId()]);
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to create branch: " . $e->getMessage(), null, 500);
        }
    }

    private function updateBranch($id, $input) {
        try {
            if (!empty($input['branch_code'])) {
                $check = $this->conn->prepare("SELECT id FROM branches WHERE branch_code = :code AND id != :id");
                $check->execute([':code' => $input['branch_code'], ':id' => $id]);
                if ($check->rowCount() > 0) {
                    jsonResponse(false, "A branch with this code already exists.", null, 409);
                    return;
                }
            }

            $fields = [];
            $params = [':id' => $id];

            $allowedFields = [
                'name', 'branch_code', 'description', 'address', 'city', 'district', 'postal_code', 
                'email', 'phone', 'alternative_phone', 'manager', 'opening_time', 'closing_time', 
                'latitude', 'longitude', 'google_maps_url', 'image_url', 'status'
            ];
            
            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $input)) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $input[$field] === '' ? null : $input[$field];
                }
            }

            if (empty($fields)) {
                jsonResponse(false, "No data to update", null, 400);
                return;
            }

            $query = "UPDATE branches SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);

            jsonResponse(true, "Branch updated successfully");
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to update branch: " . $e->getMessage(), null, 500);
        }
    }

    private function deleteBranch($id) {
        try {
            // Check for active instructors
            $checkInst = $this->conn->prepare("SELECT COUNT(*) FROM instructors WHERE branch_id = :id AND status = 'active'");
            $checkInst->execute([':id' => $id]);
            if ($checkInst->fetchColumn() > 0) {
                jsonResponse(false, "This branch cannot be deleted because it contains active instructors. Deactivate the branch instead.", null, 409);
                return;
            }

            // Check for assigned vehicles
            $checkVeh = $this->conn->prepare("SELECT COUNT(*) FROM vehicles WHERE branch_id = :id AND status = 'active'");
            $checkVeh->execute([':id' => $id]);
            if ($checkVeh->fetchColumn() > 0) {
                jsonResponse(false, "This branch cannot be deleted because it contains assigned vehicles. Deactivate the branch instead.", null, 409);
                return;
            }

            // Check for active students
            $checkStu = $this->conn->prepare("SELECT COUNT(*) FROM students WHERE branch_id = :id AND status IN ('Active', 'Pending')");
            $checkStu->execute([':id' => $id]);
            if ($checkStu->fetchColumn() > 0) {
                jsonResponse(false, "This branch cannot be deleted because it contains active students. Deactivate the branch instead.", null, 409);
                return;
            }

            // Check for active bookings
            $checkBook = $this->conn->prepare("SELECT COUNT(*) FROM bookings WHERE branch_id = :id AND status IN ('Pending', 'Confirmed')");
            $checkBook->execute([':id' => $id]);
            if ($checkBook->fetchColumn() > 0) {
                jsonResponse(false, "This branch cannot be deleted because it contains active bookings. Deactivate the branch instead.", null, 409);
                return;
            }

            $stmt = $this->conn->prepare("DELETE FROM branches WHERE id = :id");
            $stmt->execute([':id' => $id]);

            if ($stmt->rowCount() > 0) {
                jsonResponse(true, "Branch deleted successfully");
            } else {
                jsonResponse(false, "Branch not found", null, 404);
            }
        } catch(PDOException $e) {
            jsonResponse(false, "Failed to delete branch: " . $e->getMessage(), null, 500);
        }
    }
}
?>
