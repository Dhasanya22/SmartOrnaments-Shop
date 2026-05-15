<?php
header("Content-Type: application/json; charset=utf-8");

$ownerEmail = "smartornaments.shop@gmail.com";

function sendJson($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function openStoreDatabase() {
    $conn = new mysqli("localhost", "root", "");
    $conn->set_charset("utf8mb4");
    $conn->query("CREATE DATABASE IF NOT EXISTS spo_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->select_db("spo_store");

    return $conn;
}

function ensureContactsTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150),
            phone VARCHAR(30),
            subject VARCHAR(150),
            message TEXT NOT NULL,
            status VARCHAR(30) NOT NULL DEFAULT 'New',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
}

function ensureNotificationsTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(40) NOT NULL,
            title VARCHAR(150) NOT NULL,
            message TEXT,
            source_id VARCHAR(100),
            is_read TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL
        )
    ");
}

function addNotification($conn, $type, $title, $message, $sourceId = "") {
    $stmt = $conn->prepare("
        INSERT INTO notifications (type, title, message, source_id)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("ssss", $type, $title, $message, $sourceId);
    $stmt->execute();
}

function cleanHeader($value) {
    return str_replace(["\r", "\n"], "", (string)$value);
}

function sendOwnerEmail($subject, $body, $replyTo = "") {
    global $ownerEmail;

    if (!function_exists("mail")) {
        return false;
    }

    $headers = "From: SmartOrnaments <no-reply@smartornaments.shop>\r\n";

    if (filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers .= "Reply-To: " . cleanHeader($replyTo) . "\r\n";
    }

    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    return @mail($ownerEmail, cleanHeader($subject), $body, $headers);
}

function readJsonBody() {
    $rawBody = file_get_contents("php://input");
    $data = json_decode($rawBody, true);

    if (!is_array($data)) {
        sendJson(400, ["success" => false, "error" => "Invalid contact data"]);
    }

    return $data;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        sendJson(405, ["success" => false, "error" => "Please submit the contact form"]);
    }

    $data = readJsonBody();
    $name = trim($data["name"] ?? "");
    $email = trim($data["email"] ?? "");
    $phone = trim($data["phone"] ?? "");
    $subject = trim($data["subject"] ?? "Contact form");
    $message = trim($data["message"] ?? "");

    if ($name === "" || $message === "" || ($email === "" && $phone === "")) {
        sendJson(400, ["success" => false, "error" => "Name, message, and email or phone are required"]);
    }

    if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(400, ["success" => false, "error" => "Enter a valid email address"]);
    }

    $conn = openStoreDatabase();
    ensureContactsTable($conn);
    ensureNotificationsTable($conn);

    $stmt = $conn->prepare("
        INSERT INTO contacts (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);
    $stmt->execute();
    $contactId = $conn->insert_id;

    addNotification(
        $conn,
        "contact",
        "New contact message",
        $name . " sent a message: " . $subject,
        (string)$contactId
    );

    $emailBody = "New SmartOrnaments contact message\n\n"
        . "Name: " . $name . "\n"
        . "Email: " . ($email ?: "Not provided") . "\n"
        . "Phone: " . ($phone ?: "Not provided") . "\n"
        . "Subject: " . $subject . "\n\n"
        . $message;

    $emailSent = sendOwnerEmail("SmartOrnaments contact: " . $subject, $emailBody, $email);

    sendJson(201, [
        "success" => true,
        "contact" => [
            "id" => $contactId,
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "subject" => $subject,
            "message" => $message,
            "status" => "New",
            "createdAt" => date("Y-m-d H:i:s")
        ],
        "emailSent" => $emailSent
    ]);
} catch (mysqli_sql_exception $error) {
    sendJson(500, ["success" => false, "error" => "Database error"]);
}
?>
