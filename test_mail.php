<?php
// test_mail.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$to = "surajmailhere@gmail.com"; // Your email
$subject = "Test Email from localhost";
$message = "This is a test email to check if mail() function works.";
$headers = "From: test@localhost\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "✅ Email sent successfully!";
} else {
    echo "❌ Email failed to send. Check your PHP mail configuration.";
}
?>