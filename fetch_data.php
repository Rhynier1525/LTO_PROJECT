<?php
include 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT * FROM plates");
    $plates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($plates) {
        foreach ($plates as $row) {
            echo "Plate Number: " . $row["plate_number"] . " - Status: " . $row["status"] . "<br>";
        }
    } else {
        echo "No plates found.";
    }
} catch (PDOException $e) {
    echo "Error fetching data: " . $e->getMessage();
}
?>
