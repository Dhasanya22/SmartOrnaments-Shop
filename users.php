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

function ensureUsersColumn($conn, $column, $definition) {
    $stmt = $conn->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'users'
            AND COLUMN_NAME = ?
    ");
    $stmt->bind_param("s", $column);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ((int)$count === 0) {
        $conn->query("ALTER TABLE users ADD COLUMN " . $column . " " . $definition);
    }
}

function ensureUsersTable($conn) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(30) NOT NULL DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    ensureUsersColumn($conn, "role", "VARCHAR(30) NOT NULL DEFAULT 'customer' AFTER password");
    ensureUsersColumn($conn, "created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER role");
}

function getUsers($conn) {
    $users = [];
    $result = $conn->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC, id DESC");

    while ($row = $result->fetch_assoc()) {
        $users[] = [
            "id" => (int)$row["id"],
            "name" => $row["name"],
            "email" => $row["email"],
            "role" => $row["role"] ?: "customer",
            "createdAt" => $row["created_at"] ?? ""
        ];
    }

    return $users;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = openStoreDatabase();
    ensureUsersTable($conn);

    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        sendJson(405, ["success" => false, "error" => "Method not allowed"]);
    }

    requireAdmin();
    sendJson(200, ["success" => true, "users" => getUsers($conn)]);
} catch (mysqli_sql_exception $error) {
    sendJson(500, ["success" => false, "error" => "Database error"]);
}
?>
