<?php
$servername = "localhost"; // Your database server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "lto_plate_mgmt_v2"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $plate_number = $_POST['plate_number'];

    $sql = "SELECT plate_number, owner, status FROM plate_lookup WHERE plate_number = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $plate_number);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        $response = [
            'success' => true,
            'plate_number' => $data['plate_number'],
            'owner' => $data['owner'],
            'status' => $data['status']
        ];
    } else {
        $response = ['success' => false, 'message' => 'Plate not found.'];
    }

    $stmt->close();
    $conn->close();
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>