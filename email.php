<?php
// Set error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to sanitize and validate input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return $data;
}

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to log messages
function logMessage($message) {
    $logFile = __DIR__ . '/contact_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message" . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Initialize variables
$errors = [];
$success = false;
$to = 'ansabsajjad51272@outlook.com';
$from = 'info@xpertestimation.com';
$subject = 'New Contact Form Submission';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate inputs
    $fullName = !empty($_POST['full-name']) ? sanitizeInput($_POST['full-name']) : '';
    $email = !empty($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $phone = !empty($_POST['phone']) ? sanitizeInput($_POST['phone']) : 'Not provided';
    $messageSubject = !empty($_POST['subject']) ? sanitizeInput($_POST['subject']) : 'No subject';
    $message = !empty($_POST['message']) ? sanitizeInput($_POST['message']) : '';
    $service = !empty($_POST['service']) ? sanitizeInput($_POST['service']) : 'Not specified';
    $newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';

    // Validate required fields
    if (empty($fullName)) {
        $errors[] = 'Full name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!validateEmail($email)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }

    // If no validation errors, proceed to send email
    if (empty($errors)) {
        // Prepare email headers
        $headers = [
            'From: ' . $from,
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion(),
            'Content-Type: text/plain; charset=UTF-8'
        ];

        // Prepare email body
        $emailBody = "You have received a new contact form submission:\n\n" .
                   "Full Name: $fullName\n" .
                   "Email: $email\n" .
                   "Phone: $phone\n" .
                   "Subject: $messageSubject\n" .
                   "Service Interested In: $service\n" .
                   "Subscribed to Newsletter: $newsletter\n\n" .
                   "Message:\n$message";

        // Send email
        $mailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

        if ($mailSent) {
            $success = true;
            logMessage("Email sent successfully from $email");
        } else {
            $errors[] = 'Failed to send email. Please try again later.';
            logMessage("Failed to send email from $email - " . error_get_last()['message']);
        }
    } else {
        // Log validation errors
        logMessage("Form validation failed: " . implode(", ", $errors));
    }
}

// Set response header
header('Content-Type: application/json');

// Prepare response
$response = [
    'success' => $success,
    'message' => $success ? 'Thank you! Your message has been sent successfully.' : 'There was an error sending your message. Please try again.',
    'errors' => $errors
];

// Output JSON response
echo json_encode($response);
?>
