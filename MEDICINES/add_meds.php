<?php
include '../connect.php';

header('Content-Type: application/json'); // Ensure the response is in JSON format

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data and sanitize
    $medNumber = $_POST['medNumber'];
    $medName = $_POST['medName'];
    $medDesc = $_POST['medDesc'];
    $stockIn = $_POST['stockIn'];
    $stockOut = $_POST['stockOut'];
    $stockExp = $_POST['stockExp'];
    $stockAvail = $_POST['stockAvail'];

    // Initialize response array
    $response = [];

    // Prepare SQL insert query with placeholders
    $sql = "INSERT INTO inv_meds (meds_number, meds_name, med_dscrptn, stock_in, stock_out, stock_exp, stock_avail)
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        // Bind parameters to the SQL statement
        $stmt->bind_param("sssssss", $medNumber, $medName, $medDesc, $stockIn, $stockOut, $stockExp, $stockAvail);

        if ($stmt->execute()) {
            // Get the last inserted ID
            $last_id = $stmt->insert_id;

            // Fetch the newly inserted record
            $fetchSql = "SELECT * FROM inv_meds WHERE med_id = ?";
            if ($fetchStmt = $conn->prepare($fetchSql)) {
                $fetchStmt->bind_param("i", $last_id);
                $fetchStmt->execute();
                $result = $fetchStmt->get_result();
                
                $newMedicine = $result->fetch_assoc();
                
                // Set success response
                $response['success'] = true;
                $response['message'] = "Record inserted successfully.";
                $response['data'] = $newMedicine;
                
                $fetchStmt->close();
            } else {
                // Error preparing the fetch statement
                $response['success'] = false;
                $response['message'] = "Error preparing fetch statement: " . $conn->error;
            }
        } else {
            // Error during query execution
            $response['success'] = false;
            $response['message'] = "Error inserting record: " . $stmt->error;
        }

        $stmt->close();
    } else {
        // Error preparing the statement
        $response['success'] = false;
        $response['message'] = "Error preparing statement: " . $conn->error;
    }

    $conn->close();
} else {
    // Invalid request method
    $response['success'] = false;
    $response['message'] = "Invalid request method.";
}

// Return JSON response
echo json_encode($response);
?>
