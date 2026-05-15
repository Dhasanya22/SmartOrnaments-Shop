<?php
header("Content-Type: application/json; charset=utf-8");

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

function tableExists($conn, $table) {
    $stmt = $conn->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = ?
    ");
    $stmt->bind_param("s", $table);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    return (int)$count > 0;
}

function decodeImages($imagesJson, $fallbackImage) {
    $decoded = json_decode($imagesJson ?: "[]", true);
    $images = is_array($decoded) ? $decoded : [];
    array_unshift($images, $fallbackImage);
    $cleanImages = [];

    foreach ($images as $image) {
        $image = trim((string)$image);
        if ($image !== "" && !in_array($image, $cleanImages, true)) {
            $cleanImages[] = $image;
        }
    }

    return $cleanImages;
}

function getProducts($conn) {
    if (!tableExists($conn, "products")) {
        return [];
    }

    $products = [];
    $result = $conn->query("SELECT id, name, price, image, images, type, description, featured FROM products");

    while ($row = $result->fetch_assoc()) {
        $images = decodeImages($row["images"] ?? "[]", $row["image"] ?? "");
        $products[] = [
            "id" => $row["id"],
            "name" => $row["name"],
            "price" => (int)($row["price"] ?? 0),
            "image" => $images[0] ?? "images/Logo.png",
            "images" => $images,
            "type" => $row["type"] ?? "keychain",
            "description" => $row["description"] ?? "",
            "featured" => (bool)($row["featured"] ?? false)
        ];
    }

    return $products;
}

function getOrders($conn) {
    if (!tableExists($conn, "orders")) {
        return [];
    }

    $orders = [];
    $result = $conn->query("SELECT items, total FROM orders");

    while ($row = $result->fetch_assoc()) {
        $items = json_decode($row["items"] ?: "[]", true);
        $orders[] = [
            "items" => is_array($items) ? $items : [],
            "total" => (int)($row["total"] ?? 0)
        ];
    }

    return $orders;
}

function countRows($conn, $table) {
    if (!tableExists($conn, $table)) {
        return 0;
    }

    $result = $conn->query("SELECT COUNT(*) AS total FROM " . $table);
    $row = $result->fetch_assoc();

    return (int)($row["total"] ?? 0);
}

function bestSellerFromOrders($orders, $products) {
    $totals = [];

    foreach ($orders as $order) {
        foreach ($order["items"] as $item) {
            $name = trim((string)($item["name"] ?? ""));
            if ($name === "") {
                continue;
            }

            $key = strtolower($name);
            if (!isset($totals[$key])) {
                $totals[$key] = ["name" => $name, "quantity" => 0];
            }

            $totals[$key]["quantity"] += (int)($item["qty"] ?? 1);
        }
    }

    if (count($totals) === 0) {
        return null;
    }

    usort($totals, fn($a, $b) => $b["quantity"] <=> $a["quantity"]);
    $best = $totals[0];
    $matchedProduct = null;

    foreach ($products as $product) {
        if (strtolower($product["name"] ?? "") === strtolower($best["name"])) {
            $matchedProduct = $product;
            break;
        }
    }

    $best["product"] = $matchedProduct;

    return $best;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = openStoreDatabase();
    $products = getProducts($conn);
    $orders = getOrders($conn);
    $revenue = array_reduce($orders, fn($sum, $order) => $sum + (int)$order["total"], 0);

    sendJson(200, [
        "success" => true,
        "bestSeller" => bestSellerFromOrders($orders, $products),
        "totalOrders" => count($orders),
        "revenue" => $revenue,
        "productsCount" => count($products),
        "usersCount" => countRows($conn, "users")
    ]);
} catch (mysqli_sql_exception $error) {
    sendJson(500, ["success" => false, "error" => "Database error"]);
}
?>
