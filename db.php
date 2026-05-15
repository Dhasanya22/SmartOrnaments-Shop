<?php

$conn = mysqli_connect(
    "localhost",
    "root",
    ""
);

if (!$conn) {
    die("DB Failed");
}

mysqli_set_charset($conn, "utf8mb4");

mysqli_query(
    $conn,
    "CREATE DATABASE IF NOT EXISTS smartornaments CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
);

mysqli_select_db($conn, "smartornaments");

mysqli_query(
    $conn,
    "CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        price INT,
        category VARCHAR(100),
        description TEXT,
        image VARCHAR(255)
    )"
);

mysqli_query(
    $conn,
    "CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )"
);

$adminEmail = "smartornaments.shop@gmail.com";
$adminName = "SmartOrnaments Admin";
$adminPassword = getenv("SMARTORNAMENTS_ADMIN_PASSWORD") ?: "Admin@123";

$passwordHash = password_hash($adminPassword, PASSWORD_DEFAULT);
$insertAdmin = mysqli_prepare(
    $conn,
    "INSERT INTO admins (name, email, password)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE email = email"
);
mysqli_stmt_bind_param($insertAdmin, "sss", $adminName, $adminEmail, $passwordHash);
mysqli_stmt_execute($insertAdmin);

?>
