<?php
header("Content-Type: application/json; charset=utf-8");

$ownerEmail = "smartornaments.shop@gmail.com";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Please submit an order"]);
    exit;
}

$rawBody = file_get_contents("php://input");
$data = json_decode($rawBody, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid order data"]);
    exit;
}

$customer = is_array($data["customer"] ?? null) ? $data["customer"] : $data;
$items = is_array($data["items"] ?? null) ? $data["items"] : [];

$name = trim($customer["name"] ?? "");
$phone = trim($customer["phone"] ?? "");
$flatNo = trim($customer["flatNo"] ?? ($customer["flat_no"] ?? ""));
$areaStreet = trim($customer["areaStreet"] ?? ($customer["area_street"] ?? ""));
$addressType = trim($customer["addressType"] ?? ($customer["address_type"] ?? "Home"));
$address = trim($customer["address"] ?? "");
$state = trim($customer["state"] ?? "");
$district = trim($customer["district"] ?? "");
$street = trim($customer["buildingStreet"] ?? ($customer["street"] ?? $areaStreet));
$pincode = trim($customer["pincode"] ?? "");
$customizationName = trim($customer["customizationName"] ?? ($customer["customization_name"] ?? ""));
$customizationColor = trim($customer["customizationColor"] ?? ($customer["customization_color"] ?? ""));
$customizationPhotoName = trim($customer["customizationPhotoName"] ?? ($customer["customization_photo_name"] ?? ""));
$customizationPhotoData = trim($customer["customizationPhotoData"] ?? ($customer["customization_photo_data"] ?? ""));
$customization = trim($customer["customization"] ?? "None");
$deliveryNote = trim($customer["deliveryNote"] ?? ($customer["delivery_note"] ?? "None"));
$total = (int)($data["total"] ?? 0);
$offer = trim($data["offer"] ?? "No offer");

if ($address === "") {
    $address = trim($flatNo . ", " . $areaStreet, ", ");
}

if ($street === "") {
    $street = $areaStreet;
}

if ($name === "" || $phone === "" || $flatNo === "" || $areaStreet === "" || $addressType === "" || $state === "" || $district === "" || $pincode === "" || count($items) === 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required order details"]);
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

function ensureOrdersColumn($conn, $column, $definition) {
    $stmt = $conn->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'orders'
            AND COLUMN_NAME = ?
    ");
    $stmt->bind_param("s", $column);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ((int)$count === 0) {
        $conn->query("ALTER TABLE orders ADD COLUMN " . $column . " " . $definition);
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

function ensureProductStockColumn($conn) {
    if (!tableExists($conn, "products")) {
        return false;
    }

    $stmt = $conn->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'products'
            AND COLUMN_NAME = 'stock'
    ");
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ((int)$count === 0) {
        $conn->query("ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 20 AFTER description");
    }

    return true;
}

function reduceProductInventory($conn, $items) {
    if (!ensureProductStockColumn($conn)) {
        return "";
    }

    foreach ($items as $item) {
        $productId = trim((string)($item["productId"] ?? ($item["id"] ?? "")));
        $name = trim((string)($item["name"] ?? ""));
        $qty = max(1, (int)($item["qty"] ?? 1));

        if ($productId !== "") {
            $stmt = $conn->prepare("SELECT id, name, stock FROM products WHERE id = ? LIMIT 1");
            $stmt->bind_param("s", $productId);
        } else {
            $stmt = $conn->prepare("SELECT id, name, stock FROM products WHERE LOWER(name) = LOWER(?) LIMIT 1");
            $stmt->bind_param("s", $name);
        }

        $stmt->execute();
        $product = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$product) {
            continue;
        }

        if ((int)$product["stock"] < $qty) {
            return ($product["name"] ?: "Product") . " has only " . (int)$product["stock"] . " left in stock";
        }

        $update = $conn->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
        $update->bind_param("is", $qty, $product["id"]);
        $update->execute();
    }

    return "";
}

function cleanHeader($value) {
    return str_replace(["\r", "\n"], "", (string)$value);
}

function sendOwnerEmail($subject, $body) {
    global $ownerEmail;

    if (!function_exists("mail")) {
        return false;
    }

    $headers = "From: SmartOrnaments <no-reply@smartornaments.shop>\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    return @mail($ownerEmail, cleanHeader($subject), $body, $headers);
}

function formatOrderItems($items) {
    $lines = [];

    foreach ($items as $index => $item) {
        $qty = (int)($item["qty"] ?? 1);
        $name = $item["name"] ?? "Product";
        $price = (int)($item["price"] ?? 0);
        $line = ($index + 1) . ". " . $name . " x " . $qty . " - Rs. " . ($price * $qty);
        $customization = is_array($item["customization"] ?? null) ? $item["customization"] : [];
        $customName = trim($customization["customName"] ?? ($customization["name"] ?? ""));
        $color = trim($customization["color"] ?? "");
        $photoName = trim($customization["photoName"] ?? "");

        if ($customName !== "" || $color !== "" || $photoName !== "") {
            $line .= "\n   Name: " . ($customName ?: "Not provided")
                . "\n   Color: " . ($color ?: "Not selected")
                . "\n   Photo: " . ($photoName ?: "Not uploaded");
        }

        $lines[] = $line;
    }

    return implode("\n", $lines);
}

try {
    $conn = openStoreDatabase();

    $conn->query("
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            phone VARCHAR(20),
            flat_no VARCHAR(100),
            area_street VARCHAR(200),
            address_type VARCHAR(20),
            address TEXT,
            state VARCHAR(100),
            district VARCHAR(100),
            street VARCHAR(200),
            pincode VARCHAR(10),
            customization_name VARCHAR(120),
            customization_color VARCHAR(40),
            customization_photo_name VARCHAR(255),
            customization_photo_data MEDIUMTEXT,
            customization TEXT,
            delivery_note TEXT,
            items TEXT,
            total INT,
            offer VARCHAR(100),
            status VARCHAR(30) NOT NULL DEFAULT 'Pending',
            making_at DATETIME NULL,
            shipped_at DATETIME NULL,
            confirmed_at DATETIME NULL,
            delivered_at DATETIME NULL,
            updated_at DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    ensureOrdersColumn($conn, "flat_no", "VARCHAR(100) AFTER phone");
    ensureOrdersColumn($conn, "area_street", "VARCHAR(200) AFTER flat_no");
    ensureOrdersColumn($conn, "address_type", "VARCHAR(20) AFTER area_street");
    ensureOrdersColumn($conn, "customization_name", "VARCHAR(120) AFTER pincode");
    ensureOrdersColumn($conn, "customization_color", "VARCHAR(40) AFTER customization_name");
    ensureOrdersColumn($conn, "customization_photo_name", "VARCHAR(255) AFTER customization_color");
    ensureOrdersColumn($conn, "customization_photo_data", "MEDIUMTEXT AFTER customization_photo_name");
    ensureOrdersColumn($conn, "status", "VARCHAR(30) NOT NULL DEFAULT 'Pending' AFTER offer");
    ensureOrdersColumn($conn, "making_at", "DATETIME NULL AFTER status");
    ensureOrdersColumn($conn, "shipped_at", "DATETIME NULL AFTER making_at");
    ensureOrdersColumn($conn, "confirmed_at", "DATETIME NULL AFTER status");
    ensureOrdersColumn($conn, "delivered_at", "DATETIME NULL AFTER confirmed_at");
    ensureOrdersColumn($conn, "updated_at", "DATETIME NULL AFTER delivered_at");
    ensureNotificationsTable($conn);

    $inventoryError = reduceProductInventory($conn, $items);
    if ($inventoryError !== "") {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => $inventoryError]);
        exit;
    }

    $itemsJson = json_encode($items, JSON_UNESCAPED_UNICODE);

    $stmt = $conn->prepare("
        INSERT INTO orders
            (name, phone, flat_no, area_street, address_type, address, state, district, street, pincode,
                customization_name, customization_color, customization_photo_name, customization_photo_data,
                customization, delivery_note, items, total, offer)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssssssssssssssssis",
        $name,
        $phone,
        $flatNo,
        $areaStreet,
        $addressType,
        $address,
        $state,
        $district,
        $street,
        $pincode,
        $customizationName,
        $customizationColor,
        $customizationPhotoName,
        $customizationPhotoData,
        $customization,
        $deliveryNote,
        $itemsJson,
        $total,
        $offer
    );

    $stmt->execute();
    $insertId = $conn->insert_id;
    $orderId = "SO-" . $insertId;
    $createdAt = date("Y-m-d H:i:s");
    $notificationMessage = $name . " placed " . $orderId . " for Rs. " . $total;

    addNotification($conn, "order", "New order received", $notificationMessage, (string)$insertId);

    $emailBody = "New SmartOrnaments order received\n\n"
        . "Order ID: " . $orderId . "\n"
        . "Customer: " . $name . "\n"
        . "Phone: " . $phone . "\n"
        . "Address Type: " . $addressType . "\n"
        . "Address: " . $address . "\n"
        . "State: " . $state . "\n"
        . "District: " . $district . "\n"
        . "Pincode: " . $pincode . "\n"
        . "Customization Name: " . ($customizationName ?: "Not provided") . "\n"
        . "Customization Color: " . ($customizationColor ?: "Not selected") . "\n"
        . "Customization Photo: " . ($customizationPhotoName ?: "Not uploaded") . "\n"
        . "Customization Note: " . $customization . "\n"
        . "Delivery Note: " . $deliveryNote . "\n\n"
        . "Items:\n" . formatOrderItems($items) . "\n\n"
        . "Offer: " . $offer . "\n"
        . "Total: Rs. " . $total;
    $emailSent = sendOwnerEmail("SmartOrnaments order " . $orderId, $emailBody);

    echo json_encode([
        "success" => true,
        "emailSent" => $emailSent,
        "order" => [
            "id" => $orderId,
            "dbId" => $insertId,
            "items" => $items,
            "total" => $total,
            "customer" => [
                "name" => $name,
                "phone" => $phone,
                "flatNo" => $flatNo,
                "areaStreet" => $areaStreet,
                "addressType" => $addressType,
                "address" => $address,
                "state" => $state,
                "district" => $district,
                "buildingStreet" => $street,
                "pincode" => $pincode,
                "customizationName" => $customizationName,
                "customizationColor" => $customizationColor,
                "customizationPhotoName" => $customizationPhotoName,
                "customizationPhotoData" => $customizationPhotoData,
                "customization" => $customization,
                "deliveryNote" => $deliveryNote
            ],
            "offer" => $offer,
            "status" => "Pending",
            "date" => $createdAt
        ]
    ]);
} catch (mysqli_sql_exception $error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error"]);
}
?>
