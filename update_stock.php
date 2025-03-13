<?php
include 'db_connect.php';

if (isset($_POST['update_stock'])) {
    $plate_id = $_POST['plate_id'];
    $stock_status = $_POST['stock_status'];

    $query = "UPDATE plates SET stock_status = ? WHERE plate_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $stock_status, $plate_id);
    
    if ($stmt->execute()) {
        echo "Stock status updated successfully!";
    } else {
        echo "Failed to update stock status.";
    }
}
?>
