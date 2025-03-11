<?php
require_once 'db_connect.php'; // Ensure this file is correctly included

header("Content-Type: application/json");

if (!isset($pdo)) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["plate_number"])) {
    $plate_number = $_POST["plate_number"];

    // Query to check plate details
    $stmt = $pdo->prepare("SELECT p.plate_number, v.customer_id, p.status FROM plates p JOIN vehicles v ON p.vehicle_id = v.vehicle_id WHERE p.plate_number = ?");
    $stmt->execute([$plate_number]);
    $plate = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($plate) {
        // Fetch owner details
        $stmt2 = $pdo->prepare("SELECT CONCAT(first_name, ' ', last_name) AS owner FROM customers WHERE customer_id = ?");
        $stmt2->execute([$plate['customer_id']]);
        $customer = $stmt2->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "plate_number" => $plate["plate_number"],
            "owner" => $customer ? $customer["owner"] : "Unknown",
            "status" => $plate["status"]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Plate number not found."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}
?>
