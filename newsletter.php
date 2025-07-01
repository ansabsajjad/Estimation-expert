<?php
// Set content type to plain text
header('Content-Type: text/plain');

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
    
    // Check if the request method is POST
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method. Please use POST.");
    }
    
    // Get and validate email
    $email = filter_input(INPUT_POST, 'subscriber_email', FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        throw new Exception("Please provide a valid email address.");
    }
    
    // Prepare and execute the insert statement
    $stmt = $conn->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
    
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    
    if ($stmt->execute()) {
        echo "Subscribed successfully!";
    } else {
        // Check for duplicate entry error (error code 1062 for duplicate entry in MySQL)
        if ($conn->errno === 1062) {
            echo "You're already subscribed.";
        } else {
            throw new Exception("Error: " . $stmt->error);
        }
    }
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    // Return error message
    echo "Error: " . $e->getMessage();
    
    // Log the error for debugging (in a real application, you'd want to log this properly)
    error_log($e->getMessage());
    
    // Make sure to close connection if it was opened
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
