<?php
include 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT * FROM customers");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($customers) {
        echo "<h2>Customer List</h2>";
        echo "<table border='1'><tr><th>ID</th><th>Name</th><th>Email</th><th>Contact</th></tr>";
        
        foreach ($customers as $row) {
            echo "<tr>
                    <td>{$row['customer_id']}</td>
                    <td>{$row['first_name']} {$row['last_name']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['contact_number']}</td>
                  </tr>";
        }
        echo "</table>";
    } else {
        echo "No records found.";
    }
} catch (PDOException $e) {
    echo "Error fetching data: " . $e->getMessage();
}
?>
