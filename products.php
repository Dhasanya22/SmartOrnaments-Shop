<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

$adminEmail = "smartornaments.shop@gmail.com";
$legacyAdminUsername = "admin";

$categoryLabels = [
    "bracelet" => "Bracelets",
    "resin-work" => "Frames",
    "name-board-fridge-magnet" => "Name Boards",
    "keychain" => "Keychains",
    "hair-accessories" => "Hair Accessories",
    "thread-work-bangle-earrings" => "Bangles & Earrings",
    "led-gifts" => "LED Gifts",
    "couple-gifts" => "Couple Gifts"
];

function imageName($image) {
    $name = pathinfo($image, PATHINFO_FILENAME);
    return trim(preg_replace("/\s+/", " ", $name));
}

function slugText($value) {
    $slug = strtolower(trim($value));
    $slug = preg_replace("/[^a-z0-9]+/", "-", $slug);
    return trim($slug, "-");
}

$productSeedGroups = [
    [
        "type" => "bracelet",
        "price" => 199,
        "description" => "Handmade wrist candy with names, charms, and gift-ready sparkle.",
        "occasions" => ["birthday", "anniversary", "friendship-day", "valentines-day"],
        "images" => [
            "images/Braclet/Braclet.jpg",
            "images/Braclet/Braclet (2).jpg",
            "images/Braclet/Braclet (3).jpg",
            "images/Braclet/Braclet (4).jpg",
            "images/Braclet/Braclet with Charm.jpg",
            "images/Braclet/Braclet with Charm (2).jpg",
            "images/Braclet/Braclet with Charm (3).jpg",
            "images/Braclet/Braclet with Charm (4).jpg",
            "images/Braclet/Braclet with Charm (5).jpg",
            "images/Braclet/Braclet with Charm (6).jpg",
            "images/Braclet/Braclet with Charm (7).jpg",
            "images/Braclet/Braclet with Charm (8).jpg",
            "images/Braclet/Braclet with Charm (9).jpg",
            "images/Braclet/Braclet with Charm (10).jpg",
            "images/Braclet/Braclet with Charm (11).jpg",
            "images/Braclet/Braclet with Charm (12).jpg",
            "images/Braclet/Chain Braclet.jpg",
            "images/Braclet/Couple Braclet.jpg",
            "images/Braclet/Fairy Kada.jpg"
        ]
    ],
    [
        "type" => "resin-work",
        "price" => 499,
        "description" => "Glossy keepsake frames that lock your favorite memories in color.",
        "occasions" => ["birthday", "anniversary", "valentines-day"],
        "images" => [
            "images/Resin Frame Work/Resin Frame.jpg",
            "images/Resin Frame Work/Resin Frame (2).jpg",
            "images/Resin Frame Work/Resin Frame (3).jpg",
            "images/Resin Frame Work/Resin Frame (4).jpg",
            "images/Resin Frame Work/Resin Frame(3).jpg",
            "images/Resin Frame Work/Resin Frame(4).jpg"
        ]
    ],
    [
        "type" => "name-board-fridge-magnet",
        "price" => 599,
        "description" => "Personalized name boards and fridge magnets with a sweet handmade finish.",
        "occasions" => ["birthday", "anniversary"],
        "images" => [
            "images/Resin Frame Work/Resin Name Board.jpg"
        ]
    ],
    [
        "type" => "keychain",
        "price" => 149,
        "description" => "Tiny daily keepsakes with names, initials, flowers, and color pop.",
        "occasions" => ["birthday", "friendship-day", "valentines-day"],
        "images" => [
            "images/Resin Keychain/Resin Dual Color Keychain.jpg",
            "images/Resin Keychain/Resin Dual Color Keychain (2).jpg",
            "images/Resin Keychain/Resin Dual Color Keychain (3).jpg",
            "images/Resin Keychain/Resin Dual Color Keychain (4).jpg",
            "images/Resin Keychain/Resin Monocolor Keychain.jpg",
            "images/Resin Keychain/Resin Transparent Keychain.jpg",
            "images/Resin Keychain/Resin Transparent Keychain (2).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (3).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (4).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (5).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (6).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (7).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (8).jpg",
            "images/Resin Keychain/Resin Transparent Keychain (9).jpg",
            "images/Resin Keychain/Resin Tricolor Keychain.jpg",
            "images/Resin Keychain/Resin Tricolor Keychain (2).jpg"
        ]
    ],
    [
        "type" => "hair-accessories",
        "price" => 129,
        "description" => "Cute clips and bands that make everyday styling feel special.",
        "occasions" => ["birthday", "friendship-day"],
        "images" => [
            "images/Accessories/Alligator Clip.jpg",
            "images/Accessories/Centre Clip.jpg",
            "images/Accessories/Hair Band .jpg"
        ]
    ],
    [
        "type" => "thread-work-bangle-earrings",
        "price" => 159,
        "description" => "Lightweight statement pieces made for festive looks and quick gifts.",
        "occasions" => ["birthday", "friendship-day", "valentines-day"],
        "images" => [
            "images/Accessories/Neck Chain + Braclet.jpg",
            "images/Accessories/Neck Chain.jpg",
            "images/Accessories/Resin Transparent Earrings.jpg"
        ]
    ]
];

$defaultProducts = [];

foreach ($productSeedGroups as $group) {
    foreach ($group["images"] as $index => $image) {
        $name = imageName($image);
        $defaultProducts[] = [
            "id" => $group["type"] . "-" . slugText($name) . "-" . ($index + 1),
            "name" => $name,
            "price" => $group["price"],
            "image" => $image,
            "images" => [$image],
            "type" => $group["type"],
            "category" => $categoryLabels[$group["type"]] ?? "Product",
            "description" => $group["description"] . " Choose the " . $name . " design and personalize it your way.",
            "stock" => 20,
            "rating" => 4.6 + (($index % 4) / 10),
            "featured" => $index === 0,
            "occasions" => $group["occasions"]
        ];
    }
}

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

function makeProductId($name) {
    $slug = strtolower(trim($name));
    $slug = preg_replace("/[^a-z0-9]+/", "-", $slug);
    $slug = trim($slug, "-");

    if ($slug === "") {
        $slug = "product";
    }

    return $slug . "-" . time();
}

function ensureProductsColumn($conn, $column, $definition) {
    $stmt = $conn->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'products'
            AND COLUMN_NAME = ?
    ");
    $stmt->bind_param("s", $column);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ((int)$count === 0) {
        $conn->query("ALTER TABLE products ADD COLUMN " . $column . " " . $definition);
    }
}

function ensureProductsTable($conn, $defaultProducts) {
    $conn->query("
        CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(100) PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            price INT NOT NULL,
            image VARCHAR(255) NOT NULL,
            images TEXT,
            type VARCHAR(80) NOT NULL DEFAULT 'bracelet',
            category VARCHAR(100) NOT NULL DEFAULT 'Bracelets',
            description TEXT,
            stock INT NOT NULL DEFAULT 0,
            rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
            featured TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");

    ensureProductsColumn($conn, "images", "TEXT AFTER image");
    ensureProductsColumn($conn, "category", "VARCHAR(100) NOT NULL DEFAULT 'Bracelets' AFTER type");
    ensureProductsColumn($conn, "stock", "INT NOT NULL DEFAULT 20 AFTER description");
    ensureProductsColumn($conn, "rating", "DECIMAL(2,1) NOT NULL DEFAULT 0.0 AFTER stock");

    $result = $conn->query("SELECT COUNT(*) AS total FROM products");
    $row = $result->fetch_assoc();

    if ((int)$row["total"] > 0) {
        return;
    }

    $stmt = $conn->prepare("
        INSERT INTO products (id, name, price, image, images, type, category, description, stock, rating, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($defaultProducts as $product) {
        $featured = !empty($product["featured"]) ? 1 : 0;
        $imagesJson = json_encode(cleanImages($product), JSON_UNESCAPED_UNICODE);
        $rating = (float)($product["rating"] ?? 0);
        $stock = (int)($product["stock"] ?? 20);
        $stmt->bind_param(
            "ssisssssidi",
            $product["id"],
            $product["name"],
            $product["price"],
            $product["image"],
            $imagesJson,
            $product["type"],
            $product["category"],
            $product["description"],
            $stock,
            $rating,
            $featured
        );
        $stmt->execute();
    }
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

function cleanImages($data) {
    $rawImages = [];

    if (isset($data["images"]) && is_array($data["images"])) {
        $rawImages = $data["images"];
    }

    if (isset($data["image"])) {
        array_unshift($rawImages, $data["image"]);
    }

    $images = [];

    foreach ($rawImages as $image) {
        $image = trim((string)$image);

        if ($image !== "" && !in_array($image, $images, true)) {
            $images[] = $image;
        }

        if (count($images) >= 10) {
            break;
        }
    }

    return $images;
}

function decodeImages($imagesJson, $fallbackImage) {
    $decoded = json_decode($imagesJson ?: "[]", true);
    $images = is_array($decoded) ? $decoded : [];

    return cleanImages(["image" => $fallbackImage, "images" => $images]);
}

function productFromRow($row) {
    $images = decodeImages($row["images"] ?? "[]", $row["image"]);

    return [
        "id" => $row["id"],
        "name" => $row["name"],
        "price" => (int)$row["price"],
        "image" => $images[0] ?? $row["image"],
        "images" => $images,
        "type" => $row["type"],
        "category" => $row["category"] ?? "",
        "description" => $row["description"] ?? "",
        "stock" => (int)($row["stock"] ?? 0),
        "rating" => (float)($row["rating"] ?? 0),
        "featured" => (bool)$row["featured"]
    ];
}

function getProducts($conn) {
    $products = [];
    $result = $conn->query("SELECT id, name, price, image, images, type, category, description, stock, rating, featured FROM products ORDER BY created_at ASC, name ASC");

    while ($row = $result->fetch_assoc()) {
        $products[] = productFromRow($row);
    }

    return $products;
}

function readJsonBody() {
    $rawBody = file_get_contents("php://input");
    $data = json_decode($rawBody, true);

    if (!is_array($data)) {
        sendJson(400, ["success" => false, "error" => "Invalid product data"]);
    }

    return $data;
}

function cleanProductData($data, $id = "") {
    $name = trim($data["name"] ?? "");
    $price = (int)($data["price"] ?? 0);
    $images = cleanImages($data);
    $image = $images[0] ?? "";
    $imagesJson = json_encode($images, JSON_UNESCAPED_UNICODE);
    $type = trim($data["type"] ?? "bracelet");
    $category = trim($data["category"] ?? "");
    $description = trim($data["description"] ?? "");
    $stock = max(0, (int)($data["stock"] ?? 0));
    $rating = min(5, max(0, (float)($data["rating"] ?? 0)));
    $featured = !empty($data["featured"]) ? 1 : 0;
    $productId = trim($id ?: ($data["id"] ?? ""));

    if ($name === "" || $price <= 0 || $image === "") {
        sendJson(400, ["success" => false, "error" => "Product name, price, and image path are required"]);
    }

    if ($productId === "") {
        $productId = makeProductId($name);
    }

    return [
        "id" => $productId,
        "name" => $name,
        "price" => $price,
        "image" => $image,
        "images" => $images,
        "imagesJson" => $imagesJson,
        "type" => $type === "" ? "bracelet" : $type,
        "category" => $category === "" ? "Product" : $category,
        "description" => $description,
        "stock" => $stock,
        "rating" => $rating,
        "featured" => $featured
    ];
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function openStoreDatabase() {
    $conn = new mysqli("localhost", "root", "");
    $conn->set_charset("utf8mb4");
    $conn->query("CREATE DATABASE IF NOT EXISTS spo_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->select_db("spo_store");

    return $conn;
}

try {
    $conn = openStoreDatabase();
    ensureProductsTable($conn, $defaultProducts);
    ensureNotificationsTable($conn);

    $method = $_SERVER["REQUEST_METHOD"];
    $id = trim($_GET["id"] ?? "");

    if ($method === "GET") {
        sendJson(200, ["success" => true, "products" => getProducts($conn)]);
    }

    if ($method === "POST") {
        requireAdmin();
        $product = cleanProductData(readJsonBody());
        $stmt = $conn->prepare("
            INSERT INTO products (id, name, price, image, images, type, category, description, stock, rating, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "ssisssssidi",
            $product["id"],
            $product["name"],
            $product["price"],
            $product["image"],
            $product["imagesJson"],
            $product["type"],
            $product["category"],
            $product["description"],
            $product["stock"],
            $product["rating"],
            $product["featured"]
        );
        $stmt->execute();
        addNotification(
            $conn,
            "product",
            "Product added",
            $product["name"] . " was added to the shop",
            $product["id"]
        );

        sendJson(201, ["success" => true, "product" => $product, "products" => getProducts($conn)]);
    }

    if ($method === "PUT") {
        requireAdmin();
        if ($id === "") {
            sendJson(400, ["success" => false, "error" => "Product ID is required"]);
        }

        $product = cleanProductData(readJsonBody(), $id);
        $stmt = $conn->prepare("
            UPDATE products
            SET name = ?, price = ?, image = ?, images = ?, type = ?, category = ?, description = ?, stock = ?, rating = ?, featured = ?
            WHERE id = ?
        ");
        $stmt->bind_param(
            "sisssssidis",
            $product["name"],
            $product["price"],
            $product["image"],
            $product["imagesJson"],
            $product["type"],
            $product["category"],
            $product["description"],
            $product["stock"],
            $product["rating"],
            $product["featured"],
            $product["id"]
        );
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            $check = $conn->prepare("SELECT id FROM products WHERE id = ?");
            $check->bind_param("s", $product["id"]);
            $check->execute();

            if ($check->get_result()->num_rows === 0) {
                sendJson(404, ["success" => false, "error" => "Product not found"]);
            }
        }

        addNotification(
            $conn,
            "product",
            "Product updated",
            $product["name"] . " was updated",
            $product["id"]
        );

        sendJson(200, ["success" => true, "product" => $product, "products" => getProducts($conn)]);
    }

    if ($method === "DELETE") {
        requireAdmin();
        if ($id === "") {
            sendJson(400, ["success" => false, "error" => "Product ID is required"]);
        }

        $lookup = $conn->prepare("SELECT name FROM products WHERE id = ?");
        $lookup->bind_param("s", $id);
        $lookup->execute();
        $row = $lookup->get_result()->fetch_assoc();
        $productName = $row["name"] ?? "Product";

        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        addNotification($conn, "product", "Product deleted", $productName . " was removed from the shop", $id);

        sendJson(200, ["success" => true, "products" => getProducts($conn)]);
    }

    sendJson(405, ["success" => false, "error" => "Method not allowed"]);
} catch (mysqli_sql_exception $error) {
    sendJson(500, ["success" => false, "error" => "Database error"]);
}
?>
