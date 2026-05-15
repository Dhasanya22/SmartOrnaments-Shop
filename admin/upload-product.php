<?php

include("../db.php");
include("auth.php");

requireAdminLogin();

function sizeToBytes($value) {
    $value = trim((string)$value);

    if ($value === "") {
        return 0;
    }

    $unit = strtolower($value[strlen($value) - 1]);
    $number = (float)$value;

    switch ($unit) {
        case "g":
            $number *= 1024;
        case "m":
            $number *= 1024;
        case "k":
            $number *= 1024;
    }

    return (int)$number;
}

function formatBytes($bytes) {
    if ($bytes >= 1024 * 1024) {
        return round($bytes / (1024 * 1024), 1) . " MB";
    }

    return round($bytes / 1024) . " KB";
}

function uploadErrorMessage($errorCode, $maxImageSize) {
    switch ($errorCode) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            return "Image is too large for this server. Please upload a JPG or PNG below " . formatBytes($maxImageSize) . ".";
        case UPLOAD_ERR_PARTIAL:
            return "Image upload was incomplete. Please try again.";
        case UPLOAD_ERR_NO_FILE:
            return "Please choose a product image.";
        case UPLOAD_ERR_NO_TMP_DIR:
            return "Upload temp folder is missing in server.";
        case UPLOAD_ERR_CANT_WRITE:
            return "Server could not save the uploaded image.";
        case UPLOAD_ERR_EXTENSION:
            return "PHP blocked this image upload.";
        default:
            return "Image upload failed. Error code: " . $errorCode;
    }
}

$appImageLimit = 5 * 1024 * 1024;
$phpUploadLimit = sizeToBytes(ini_get("upload_max_filesize"));
$postMaxBytes = sizeToBytes(ini_get("post_max_size"));
$maxImageSize = $appImageLimit;

foreach ([$phpUploadLimit, $postMaxBytes > 0 ? $postMaxBytes - 128 * 1024 : 0] as $limit) {
    if ($limit > 0) {
        $maxImageSize = min($maxImageSize, $limit);
    }
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo "Please submit the product form.";
    exit;
}

$contentLength = (int)($_SERVER["CONTENT_LENGTH"] ?? 0);

if ($postMaxBytes > 0 && $contentLength > $postMaxBytes) {
    http_response_code(400);
    echo "Upload is too large for the server. Please choose a JPG or PNG below " . formatBytes($postMaxBytes) . ".";
    exit;
}

$formImageLimit = (int)($_POST["MAX_FILE_SIZE"] ?? 0);

if ($formImageLimit > 0) {
    $maxImageSize = min($maxImageSize, $formImageLimit);
}

$name = trim($_POST["name"] ?? "");
$price = (int)($_POST["price"] ?? 0);
$category = trim($_POST["category"] ?? "");
$description = trim($_POST["description"] ?? "");

if ($name === "" || $price <= 0 || $category === "" || $description === "") {
    http_response_code(400);
    echo "Please fill all product details.";
    exit;
}

if (!isset($_FILES["image"])) {
    http_response_code(400);
    echo "Please choose a product image.";
    exit;
}

$imageUpload = $_FILES["image"];

if ($imageUpload["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo uploadErrorMessage($imageUpload["error"], $maxImageSize);
    exit;
}

if ($imageUpload["size"] > $maxImageSize) {
    http_response_code(400);
    echo "Image size is too large. Please choose an image below " . formatBytes($maxImageSize) . ".";
    exit;
}

$uploadDir = "../uploads/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$originalName = basename($imageUpload["name"]);
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$allowedExtensions = ["jpg", "jpeg", "png"];

if (!in_array($extension, $allowedExtensions, true)) {
    http_response_code(400);
    echo "Only JPG and PNG images are allowed.";
    exit;
}

$imageInfo = getimagesize($imageUpload["tmp_name"]);

if ($imageInfo === false || !in_array($imageInfo["mime"], ["image/jpeg", "image/png"], true)) {
    http_response_code(400);
    echo "Please upload a valid JPG or PNG image.";
    exit;
}

$image = time() . "-" . preg_replace("/[^A-Za-z0-9._-]/", "-", $originalName);
$targetPath = $uploadDir . $image;

if (!move_uploaded_file($imageUpload["tmp_name"], $targetPath)) {
    http_response_code(500);
    echo "Image upload failed.";
    exit;
}

$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO products (name, price, category, description, image) VALUES (?, ?, ?, ?, ?)"
);

mysqli_stmt_bind_param($stmt, "sisss", $name, $price, $category, $description, $image);
mysqli_stmt_execute($stmt);

echo "Product Uploaded!";

?>
