<?php
// Set content type to JSON
header('Content-Type: application/json');

// Function to send JSON response
function sendResponse($success, $message, $error = false) {
    $status = 'success';
    
    if ($error) {
        $status = 'error';
    } elseif ($message === 'You\'re already subscribed.') {
        $status = 'warning';
    }
    
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'error' => $error,
        'status' => $status
    ]);
    exit;
}

// Database configuration
$db_host = 'localhost';
$db_name = 'u374909398_NewsetterEmail';
$db_user = 'u374909398_AnsabSajjad';
$db_pass = '3D#tY@c1Zg';

try {
    // Create database connection
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Set charset to utf8mb4 for proper encoding
    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Error loading character set utf8mb4: " . $conn->error);
    }
    
    // Check if the request method is POST and is AJAX
    if ($_SERVER["REQUEST_METHOD"] !== "POST" || empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        sendResponse(false, 'Invalid request', true);
    }
    
    // Get and validate email
    if (empty($_POST['subscriber_email'])) {
        sendResponse(false, 'Email is required', true);
    }
    
    $email = filter_var($_POST['subscriber_email'], FILTER_VALIDATE_EMAIL);
    if (!$email) {
        sendResponse(false, 'Please provide a valid email address', true);
    }
    
    // Prepare and execute the insert statement
    $stmt = $conn->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
    
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    
    if ($stmt->execute()) {
        sendResponse(true, 'Subscribed successfully!');
    } else {
        // Check for duplicate entry error (error code 1062 for duplicate entry in MySQL)
        if ($conn->errno === 1062) {
            sendResponse(false, 'You\'re already subscribed.', true);
        } else {
            throw new Exception($stmt->error);
        }
    }
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    // Return error message as JSON
    sendResponse(false, $e->getMessage(), true);
    
    // Log the error for debugging
    error_log('Newsletter Error: ' . $e->getMessage());
    
    // Make sure to close connection if it was opened
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
