<?php
// config.php
// Centralized configuration file

// Error reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_username');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'elitesdev_bookings');

// Email Configuration
define('ADMIN_EMAIL', 'suraj@elitesdev.com');
define('FROM_EMAIL', 'noreply@elitesdev.com');
define('FROM_NAME', 'ElitesDev Bookings');

// Site Configuration
define('SITE_URL', 'https://elitesdev.com');
define('SITE_NAME', 'ElitesDev');

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Database connection function
function getDbConnection() {
    static $conn = null;
    
    if ($conn === null) {
        try {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            
            if ($conn->connect_error) {
                throw new Exception('Database connection failed: ' . $conn->connect_error);
            }
            
            $conn->set_charset('utf8mb4');
        } catch (Exception $e) {
            error_log($e->getMessage());
            return false;
        }
    }
    
    return $conn;
}

// Security function - prevent SQL injection
function sanitizeString($str) {
    $conn = getDbConnection();
    return $conn ? $conn->real_escape_string(trim($str)) : trim($str);
}

// Log errors to file
function logError($message) {
    $logFile = __DIR__ . '/logs/error.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}\n";
    
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Rate limiting function (simple implementation)
function checkRateLimit($identifier, $maxRequests = 5, $timeWindow = 3600) {
    $cacheFile = __DIR__ . '/cache/rate_limit_' . md5($identifier) . '.txt';
    $cacheDir = dirname($cacheFile);
    
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0755, true);
    }
    
    $now = time();  
    $requests = [];
    
    if (file_exists($cacheFile)) {
        $data = file_get_contents($cacheFile);
        $requests = json_decode($data, true) ?: [];
    }
    
    // Remove old requests outside time window
    $requests = array_filter($requests, function($timestamp) use ($now, $timeWindow) {
        return ($now - $timestamp) < $timeWindow;
    });
    
    if (count($requests) >= $maxRequests) {
        return false; // Rate limit exceeded
    }
    
    $requests[] = $now;
    file_put_contents($cacheFile, json_encode($requests));
    
    return true; // Within rate limit
}
?>