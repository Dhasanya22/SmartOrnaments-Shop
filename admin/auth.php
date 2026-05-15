<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isAdminLoggedIn() {
    return !empty($_SESSION["admin_logged_in"])
        && !empty($_SESSION["admin_id"])
        && !empty($_SESSION["admin_email"]);
}

function requireAdminLogin() {
    if (isAdminLoggedIn()) {
        return;
    }

    $currentUrl = $_SERVER["REQUEST_URI"] ?? "dashboard.php";
    header("Location: login.php?next=" . urlencode($currentUrl));
    exit;
}

function adminName() {
    return $_SESSION["admin_name"] ?? "Admin";
}

function adminEmail() {
    return $_SESSION["admin_email"] ?? "";
}

?>
