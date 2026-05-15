<?php
session_start();
header("Content-Type: text/plain; charset=utf-8");

$adminEmail = "smartornaments.shop@gmail.com";
$legacyAdminUsername = "admin";
$adminPassword = getenv("ADMIN_PASSWORD") ?: "admin123";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Please submit the login form";
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(400);
    echo "Email and password are required";
    exit;
}

if (
    in_array(strtolower($email), [strtolower($adminEmail), $legacyAdminUsername], true)
    && hash_equals($adminPassword, $password)
) {
    $_SESSION["user"] = $adminEmail;
    $_SESSION["email"] = $adminEmail;
    $_SESSION["role"] = "admin";

    echo "Login Successful";
    exit;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

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

try {
    $conn = openStoreDatabase();
    ensureUsersTable($conn);

    $stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo "User Not Found";
        exit;
    }

    $row = $result->fetch_assoc();

    if (!password_verify($password, $row["password"])) {
        http_response_code(401);
        echo "Wrong Password";
        exit;
    }

    $_SESSION["user"] = $row["name"];
    $_SESSION["email"] = $row["email"];
    $_SESSION["role"] = $row["role"] ?: "customer";

    echo "Login Successful";
} catch (mysqli_sql_exception $error) {
    http_response_code(500);
    echo "Database error";
}
?>
