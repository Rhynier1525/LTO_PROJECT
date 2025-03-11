<?php
require 'vendor/autoload.php';
require 'db_connect.php'; // Database connection

use PhpOffice\PhpSpreadsheet\IOFactory;

if (isset($_FILES['excel_file']) && $_FILES['excel_file']['error'] == 0) {
    $filePath = $_FILES['excel_file']['tmp_name'];

    try {
        $spreadsheet = IOFactory::load($filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        // Skip the first row (headers)
        array_shift($rows);

        foreach ($rows as $row) {
            $plate_number = trim($row[0]); // Plate Number
            $customer_id = trim($row[1]);  // Customer ID
            $vehicle_id = trim($row[2]);   // Vehicle ID
            $status = trim($row[3]);       // Status
            $date_arrived = trim($row[4]); // Date Arrived

            // Check if the vehicle_id exists in the vehicles table
            $stmt = $pdo->prepare("SELECT vehicle_id FROM vehicles WHERE vehicle_id = ?");
            $stmt->execute([$vehicle_id]);
            $vehicle = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$vehicle) {
                echo "❌ Error: Vehicle ID '$vehicle_id' not found in database. Skipping this row.<br>";
                continue; // Skip this row and move to the next
            }

            // Get vehicle_id using plate_number from the database
$stmt = $pdo->prepare("SELECT vehicle_id FROM vehicles WHERE plate_number = ?");
$stmt->execute([$plate_number]);
$vehicle = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$vehicle) {
    echo "❌ Error: No matching vehicle found for Plate Number '$plate_number'. Skipping this row.<br>";
    continue; // Skip row if no vehicle_id is found
}

$vehicle_id = $vehicle['vehicle_id']; // Assign the correct vehicle_id dynamically


            // Insert into the plates table
            $stmt = $pdo->prepare("INSERT INTO plates (plate_number, customer_id, vehicle_id, status, release_date) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$plate_number, $customer_id, $vehicle_id, $status, $date_arrived]);

            echo "✅ Inserted: $plate_number | Customer ID: $customer_id | Vehicle ID: $vehicle_id | Status: $status | Date Arrived: $date_arrived<br>";
        }

        echo "<br>✅ Bulk upload completed!";
    } catch (Exception $e) {
        echo "❌ Error reading the Excel file: " . $e->getMessage();
    }
} else {
    echo "❌ Error: No file uploaded or an upload error occurred.";
}
?>
