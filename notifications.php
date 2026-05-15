<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

$adminEmail = "smartornaments.shop@gmail.com";
$legacyAdminUsername = "admin";

function sendJson($status, $data) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function isAdminSession() {
    global $adminEmail, $legacyAdminUsername;

    $role = strtolower($_SESSION["role"] ?? "");
    $email = strtolower($_SESSION["email"] ?? "");
    $user = strtolower($_SESSION["user"] ?? "");

    return $role === "admin"
        || $email === strtolower($adminEmail)
        || $user === strtolower($adminEmail)
        || $user === $legacyAdminUsername;
}

function requireAdmin() {
    if (!isAdminSession()) {
        sendJson(403, ["success" => false, "error" => "Admin login required"]);
    }
}

function openStoreDatabase() {
    $conn = new mysqli("localhost", "root", "");
    $conn->set_charset("utf8mb4");
    $conn->query("CREATE DATABASE IF NOT EXISTS spo_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->select_db("spo_store");

    return $conn;
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

function notificationFromRow($row) {
    return [
        "id" => (int)$row["id"],
        "type" => $row["type"] ?? "",
        "title" => $row["title"] ?? "",
        "message" => $row["message"] ?? "",
        "sourceId" => $row["source_id"] ?? "",
        "read" => (bool)$row["is_read"],
        "createdAt" => $row["created_at"] ?? "",
        "updatedAt" => $row["updated_at"] ?? ""
    ];
}

function getNotifications($conn) {
    $notifications = [];
    $result = $conn->query("
        SELECT id, type, title, message, source_id, is_read, created_at, updated_at
        FROM notifications
        ORDER BY id DESC
        LIMIT 100
    ");

    while ($row = $result->fetch_assoc()) {
        $notifications[] = notificationFromRow($row);
    }

    return $notifications;
}

function readJsonBody() {
    $rawBody = file_get_contents("php://input");
    $data = json_decode($rawBody, true);

    return is_array($data) ? $data : [];
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    requireAdmin();

    $conn = openStoreDatabase();
    ensureNotificationsTable($conn);

    $method = $_SERVER["REQUEST_METHOD"];
    $id = (int)($_GET["id"] ?? 0);

    if ($method === "GET") {
        sendJson(200, ["success" => true, "notifications" => getNotifications($conn)]);
    }

    if ($method === "PATCH") {
        if ($id <= 0) {
            sendJson(400, ["success" => false, "error" => "Notification ID is required"]);
        }

        $data = readJsonBody();
        $isRead = array_key_exists("read", $data) ? (int)(bool)$data["read"] : 1;
        $stmt = $conn->prepare("UPDATE notifications SET is_read = ?, updated_at = NOW() WHERE id = ?");
        $stmt->bind_param("ii", $isRead, $id);
        $stmt->execute();

        sendJson(200, ["success" => true, "notifications" => getNotifications($conn)]);
    }

    if ($method === "DELETE") {
        $conn->query("DELETE FROM notifications WHERE is_read = 1");
        sendJson(200, ["success" => true, "notifications" => getNotifications($conn)]);
    }

    sendJson(405, ["success" => false, "error" => "Method not allowed"]);
} catch (mysqli_sql_exception $error) {
    sendJson(500, ["success" => false, "error" => "Database error"]);
}
?>
