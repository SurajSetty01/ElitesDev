<?php
// process_booking.php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Import PHPMailer classes
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Database Configuration
define('DB_HOST', 'localhost:3307');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'elitesdev_bookings');

// Email Configuration - UPDATE THESE
define('GMAIL_USERNAME', 'surajmailhere@gmail.com'); // Your Gmail address
define('GMAIL_APP_PASSWORD', 'xfkz ezoy gqzn omty'); // The app password you generated
define('ADMIN_EMAIL', 'surajmailhere@gmail.com'); // Where bookings should be sent

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// If JSON decode fails, try regular POST data
if (!$input) {
    $input = $_POST;
}

// Validation function
function validateInput($data) {
    $errors = [];
    
    if (empty($data['selectedService'])) {
        $errors[] = 'Service selection is required';
    }
    
    if (empty($data['clientFullName'])) {
        $errors[] = 'Full name is required';
    }
    
    if (empty($data['clientEmail'])) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($data['clientEmail'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    if (empty($data['preferredCallDate'])) {
        $errors[] = 'Preferred call date is required';
    }
    
    if (empty($data['projectMessage'])) {
        $errors[] = 'Project description is required';
    }
    
    return $errors;
}

// Sanitize input
function sanitizeInput($data) {
    return [
        'selectedService' => htmlspecialchars(trim($data['selectedService'] ?? '')),
        'clientFullName' => htmlspecialchars(trim($data['clientFullName'] ?? '')),
        'clientEmail' => filter_var(trim($data['clientEmail'] ?? ''), FILTER_SANITIZE_EMAIL),
        'clientPhone' => htmlspecialchars(trim($data['clientPhone'] ?? '')),
        'clientCompany' => htmlspecialchars(trim($data['clientCompany'] ?? '')),
        'preferredCallDate' => htmlspecialchars(trim($data['preferredCallDate'] ?? '')),
        'preferredCallTime' => htmlspecialchars(trim($data['preferredCallTime'] ?? '')),
        'projectMessage' => htmlspecialchars(trim($data['projectMessage'] ?? ''))
    ];
}

// Validate input
$errors = validateInput($input);

if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ]);
    exit();
}

// Sanitize input
$data = sanitizeInput($input);

// Map service codes to readable names
$serviceNames = [
    'branding' => 'Branding & Marketing',
    'webdev' => 'Web Development',
    'marketing' => 'Digital Marketing'
];

$serviceName = $serviceNames[$data['selectedService']] ?? $data['selectedService'];

// Map time slots
$timeSlots = [
    'morning' => 'Morning (9 AM - 12 PM)',
    'afternoon' => 'Afternoon (12 PM - 4 PM)',
    'evening' => 'Evening (4 PM - 7 PM)'
];

$timeSlot = $timeSlots[$data['preferredCallTime']] ?? $data['preferredCallTime'];

// Save to database
$bookingId = null;
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    $stmt = $conn->prepare("INSERT INTO bookings (service, full_name, email, phone, company, call_date, call_time, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    
    $stmt->bind_param(
        "ssssssss",
        $data['selectedService'],
        $data['clientFullName'],
        $data['clientEmail'],
        $data['clientPhone'],
        $data['clientCompany'],
        $data['preferredCallDate'],
        $data['preferredCallTime'],
        $data['projectMessage']
    );
    
    $stmt->execute();
    $bookingId = $conn->insert_id;
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    error_log('Database error: ' . $e->getMessage());
}

// Send Admin Email
$adminEmailSent = false;
try {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = GMAIL_USERNAME;
    $mail->Password = GMAIL_APP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Recipients
    $mail->setFrom(GMAIL_USERNAME, 'ElitesDev Bookings');
    $mail->addAddress(ADMIN_EMAIL);
    $mail->addReplyTo($data['clientEmail'], $data['clientFullName']);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "🎯 New Consultation Booking - {$serviceName}";
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #000; margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #FFD700; margin-bottom: 5px; }
            .field-value { background: white; padding: 12px; border-radius: 5px; border-left: 3px solid #FFD700; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✨ New Consultation Request</h1>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='field-label'>Service Requested:</div>
                    <div class='field-value'>{$serviceName}</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Client Name:</div>
                    <div class='field-value'>{$data['clientFullName']}</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Email:</div>
                    <div class='field-value'>{$data['clientEmail']}</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Phone:</div>
                    <div class='field-value'>" . ($data['clientPhone'] ?: 'Not provided') . "</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Company:</div>
                    <div class='field-value'>" . ($data['clientCompany'] ?: 'Not provided') . "</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Preferred Call Date:</div>
                    <div class='field-value'>" . date('F j, Y', strtotime($data['preferredCallDate'])) . "</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Preferred Time:</div>
                    <div class='field-value'>" . ($timeSlot ?: 'Not specified') . "</div>
                </div>
                
                <div class='field'>
                    <div class='field-label'>Project Details:</div>
                    <div class='field-value'>" . nl2br($data['projectMessage']) . "</div>
                </div>
                
                <div class='footer'>
                    <p>Booking ID: " . ($bookingId ?? 'N/A') . " | Received: " . date('F j, Y g:i A') . "</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->send();
    $adminEmailSent = true;
} catch (Exception $e) {
    error_log("Admin email failed: " . $mail->ErrorInfo);
}

// Send Client Email
$clientEmailSent = false;
try {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = GMAIL_USERNAME;
    $mail->Password = GMAIL_APP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    // Recipients
    $mail->setFrom(GMAIL_USERNAME, 'ElitesDev');
    $mail->addAddress($data['clientEmail'], $data['clientFullName']);
    $mail->addReplyTo(ADMIN_EMAIL);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "Thank You for Your Consultation Request - ElitesDev";
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: #000; margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700; margin: 20px 0; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🎉 Thank You, {$data['clientFullName']}!</h1>
            </div>
            <div class='content'>
                <p>We've received your consultation request and we're excited to work with you!</p>
                
                <div class='highlight'>
                    <h3 style='margin-top: 0; color: #FFD700;'>📋 Your Booking Summary</h3>
                    <p><strong>Service:</strong> {$serviceName}</p>
                    <p><strong>Scheduled Date:</strong> " . date('F j, Y', strtotime($data['preferredCallDate'])) . "</p>
                    <p><strong>Preferred Time:</strong> " . ($timeSlot ?: 'To be confirmed') . "</p>
                </div>
                
                <h3>What Happens Next?</h3>
                <ol>
                    <li>Our team will review your project details</li>
                    <li>We'll contact you within 24 hours to confirm your consultation</li>
                    <li>We'll prepare a customized approach for your project</li>
                </ol>
                
                <p>If you have any immediate questions, feel free to reply to this email or call us at <strong>+91 77579 07676</strong>.</p>
                
                <center>
                    <a href='https://elitesdev.com' class='button'>Visit Our Website</a>
                </center>
                
                <div class='footer'>
                    <p><strong>ElitesDev</strong><br>
                    Chennai, Tamil Nadu, India<br>
                    <a href='mailto:contact@elitesdev.com'>contact@elitesdev.com</a> | +91 77579 07676</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->send();
    $clientEmailSent = true;
} catch (Exception $e) {
    error_log("Client email failed: " . $mail->ErrorInfo);
}

// Return response
if ($adminEmailSent && $clientEmailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Consultation booked successfully! Check your email for confirmation.',
        'bookingId' => $bookingId
    ]);
} elseif ($bookingId) {
    echo json_encode([
        'success' => true,
        'message' => 'Consultation saved! We will contact you shortly.',
        'bookingId' => $bookingId,
        'emailStatus' => [
            'admin' => $adminEmailSent,
            'client' => $clientEmailSent
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to process booking. Please try again or contact us directly.'
    ]);
}
?>