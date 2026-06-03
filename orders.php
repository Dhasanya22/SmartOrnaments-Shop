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
    $conn->query("CREATE DATABASE IF NOT EXISTS smartornaments CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $conn->select_db("smartornaments");

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

function ensureOrdersTable($conn) {
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
            payment_method VARCHAR(40) NOT NULL DEFAULT 'cod',
            payment_status VARCHAR(40) NOT NULL DEFAULT 'Pending',
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
    ensureOrdersColumn($conn, "payment_method", "VARCHAR(40) NOT NULL DEFAULT 'cod' AFTER offer");
    ensureOrdersColumn($conn, "payment_status", "VARCHAR(40) NOT NULL DEFAULT 'Pending' AFTER payment_method");
    ensureOrdersColumn($conn, "status", "VARCHAR(30) NOT NULL DEFAULT 'Pending' AFTER offer");
    ensureOrdersColumn($conn, "making_at", "DATETIME NULL AFTER status");
    ensureOrdersColumn($conn, "shipped_at", "DATETIME NULL AFTER making_at");
    ensureOrdersColumn($conn, "confirmed_at", "DATETIME NULL AFTER status");
    ensureOrdersColumn($conn, "delivered_at", "DATETIME NULL AFTER confirmed_at");
    ensureOrdersColumn($conn, "updated_at", "DATETIME NULL AFTER delivered_at");
}

function ensureNotificationsColumn($conn, $column, $definition) {
    $stmt = $conn->prepare("
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'notifications'
            AND COLUMN_NAME = ?
    ");
    $stmt->bind_param("s", $column);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ((int)$count === 0) {
        $conn->query("ALTER TABLE notifications ADD COLUMN " . $column . " " . $definition);
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
            recipient_role VARCHAR(30) NOT NULL DEFAULT 'admin',
            recipient_email VARCHAR(150),
            recipient_phone VARCHAR(30),
            action_label VARCHAR(80),
            action_url TEXT,
            is_read TINYINT(1) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL
        )
    ");

    ensureNotificationsColumn($conn, "recipient_role", "VARCHAR(30) NOT NULL DEFAULT 'admin' AFTER source_id");
    ensureNotificationsColumn($conn, "recipient_email", "VARCHAR(150) AFTER recipient_role");
    ensureNotificationsColumn($conn, "recipient_phone", "VARCHAR(30) AFTER recipient_email");
    ensureNotificationsColumn($conn, "action_label", "VARCHAR(80) AFTER recipient_phone");
    ensureNotificationsColumn($conn, "action_url", "TEXT AFTER action_label");
}

function getOrderDbId($value) {
    $id = trim((string)$value);

    if (preg_match("/^SO-(\d+)$/i", $id, $matches)) {
        return (int)$matches[1];
    }

    return (int)$id;
}

function decodeItems($itemsJson) {
    $items = json_decode($itemsJson ?: "[]", true);
    return is_array($items) ? $items : [];
}

function cleanPhone($value) {
    $digits = preg_replace("/\D+/", "", (string)$value);

    if (strlen($digits) === 10) {
        return "91" . $digits;
    }

    if (strlen($digits) === 11 && str_starts_with($digits, "0")) {
        return "91" . substr($digits, 1);
    }

    return $digits;
}

function dbStatusFromRequest($status) {
    $status = trim((string)$status);

    if ($status === "Processing") return "Pending";
    if ($status === "Confirmed" || $status === "Packed") return "Making";
    if (in_array($status, ["Pending", "Making", "Shipped", "Delivered"], true)) return $status;

    return "";
}

function displayStatus($status) {
    if ($status === "Pending") return "Processing";
    if ($status === "Confirmed" || $status === "Making") return "Packed";

    return $status ?: "Processing";
}

function formatMoneyText($amount) {
    return "Rs. " . (int)$amount;
}

function orderItemsSummary($itemsJson) {
    $items = decodeItems($itemsJson);
    $lines = [];

    foreach ($items as $index => $item) {
        $qty = max(1, (int)($item["qty"] ?? 1));
        $name = trim((string)($item["name"] ?? "Product"));
        $price = (int)($item["price"] ?? 0) * $qty;
        $lines[] = ($index + 1) . ". " . $name . " x " . $qty . " - " . formatMoneyText($price);
    }

    return count($lines) ? implode("; ", $lines) : "Items not provided";
}

function buildPayNowUrl($row) {
    $orderId = "SO-" . $row["id"];
    $message = "Hi SmartOrnaments, I want to pay for my confirmed order.\n\n"
        . "Order ID: " . $orderId . "\n"
        . "Customer: " . ($row["name"] ?? "Customer") . "\n"
        . "Phone: " . ($row["phone"] ?? "Not provided") . "\n\n"
        . "Products:\n" . str_replace("; ", "\n", orderItemsSummary($row["items"] ?? "[]")) . "\n\n"
        . "Total: " . formatMoneyText($row["total"] ?? 0);

    return "https://wa.me/916374118664?text=" . rawurlencode($message);
}

function addCustomerStatusNotification($conn, $row, $status) {
    $phone = cleanPhone($row["phone"] ?? "");

    if ($phone === "") {
        return;
    }

    $orderId = "SO-" . $row["id"];
    $title = "Order " . $status;
    $message = $orderId . " is now " . $status . ". Products: "
        . orderItemsSummary($row["items"] ?? "[]")
        . ". Total: " . formatMoneyText($row["total"] ?? 0)
        . ". Pay Now option is ready.";
    $actionLabel = "Pay Now";
    $actionUrl = buildPayNowUrl($row);
    $type = "customer";
    $role = "customer";
    $email = "";

    $stmt = $conn->prepare("
        INSERT INTO notifications
            (type, title, message, source_id, recipient_role, recipient_email, recipient_phone, action_label, action_url)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssssss", $type, $title, $message, $orderId, $role, $email, $phone, $actionLabel, $actionUrl);
    $stmt->execute();
}

function orderFromRow($row) {
    $createdAt = $row["created_at"] ?? "";
    $status = ($row["status"] ?? "") === "Confirmed" ? "Making" : ($row["status"] ?: "Pending");

    return [
        "id" => "SO-" . $row["id"],
        "dbId" => (int)$row["id"],
        "items" => decodeItems($row["items"] ?? "[]"),
        "total" => (int)($row["total"] ?? 0),
        "customer" => [
            "name" => $row["name"] ?? "",
            "phone" => $row["phone"] ?? "",
            "flatNo" => $row["flat_no"] ?? "",
            "areaStreet" => $row["area_street"] ?? "",
            "addressType" => $row["address_type"] ?? "",
            "address" => $row["address"] ?? "",
            "state" => $row["state"] ?? "",
            "district" => $row["district"] ?? "",
            "buildingStreet" => $row["street"] ?? "",
            "pincode" => $row["pincode"] ?? "",
            "customizationName" => $row["customization_name"] ?? "",
            "customizationColor" => $row["customization_color"] ?? "",
            "customizationPhotoName" => $row["customization_photo_name"] ?? "",
            "customizationPhotoData" => $row["customization_photo_data"] ?? "",
            "customization" => $row["customization"] ?? "None",
            "deliveryNote" => $row["delivery_note"] ?? "None"
        ],
        "offer" => $row["offer"] ?? "No offer",
        "paymentMethod" => $row["payment_method"] ?? "cod",
        "paymentStatus" => $row["payment_status"] ?? "Pending",
        "status" => $status,
        "date" => $createdAt,
        "placedAt" => $createdAt,
        "makingAt" => $row["making_at"] ?? ($row["confirmed_at"] ?? ""),
        "shippedAt" => $row["shipped_at"] ?? "",
        "confirmedAt" => $row["confirmed_at"] ?? ($row["making_at"] ?? ""),
        "deliveredAt" => $row["delivered_at"] ?? "",
        "updatedAt" => $row["updated_at"] ?? ""
    ];
}

function getOrders($conn) {
    $orders = [];
    $result = $conn->query("
        SELECT id, name, phone, flat_no, area_street, address_type, address,
            state, district, street, pincode, customization_name, customization_color,
            customization_photo_name, customization_photo_data, customization, delivery_note,
            items, total, offer, payment_method, payment_status, status, making_at, shipped_at, confirmed_at, delivered_at, updated_at, created_at
        FROM orders
        ORDER BY id DESC
    ");

    while ($row = $result->fetch_assoc()) {
        $orders[] = orderFromRow($row);
    }

    return $orders;
}

function readJsonBody() {
    $rawBody = file_get_contents("php://input");
    $data = json_decode($rawBody, true);

    if (!is_array($data)) {
        sendJson(400, ["success" => false, "error" => "Invalid order data"]);
    }

    return $data;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = openStoreDatabase();
    ensureOrdersTable($conn);
    ensureNotificationsTable($conn);

    $method = $_SERVER["REQUEST_METHOD"];
    $dbId = getOrderDbId($_GET["id"] ?? "");

    if ($method === "GET") {
        requireAdmin();
        sendJson(200, ["success" => true, "orders" => getOrders($conn)]);
    }

    if ($method === "PATCH") {
        requireAdmin();
        if ($dbId <= 0) {
            sendJson(400, ["success" => false, "error" => "Order ID is required"]);
        }

        $currentOrder = $conn->prepare("
            SELECT id, name, phone, flat_no, area_street, address_type, address,
                state, district, street, pincode, customization_name, customization_color,
                customization_photo_name, customization_photo_data, customization, delivery_note,
                items, total, offer, payment_method, payment_status, status, making_at, shipped_at, confirmed_at, delivered_at, updated_at, created_at
            FROM orders
            WHERE id = ?
        ");
        $currentOrder->bind_param("i", $dbId);
        $currentOrder->execute();
        $previousRow = $currentOrder->get_result()->fetch_assoc();

        if (!$previousRow) {
            sendJson(404, ["success" => false, "error" => "Order not found"]);
        }

        $data = readJsonBody();
        $status = dbStatusFromRequest($data["status"] ?? "Pending");

        if ($status === "") {
            sendJson(400, ["success" => false, "error" => "Invalid order status"]);
        }

        $stmt = $conn->prepare("
            UPDATE orders
            SET status = ?,
                making_at = IF(? = 'Making' AND making_at IS NULL, NOW(), making_at),
                shipped_at = IF(? = 'Shipped' AND shipped_at IS NULL, NOW(), shipped_at),
                confirmed_at = IF(? = 'Making' AND confirmed_at IS NULL, NOW(), confirmed_at),
                delivered_at = IF(? = 'Delivered' AND delivered_at IS NULL, NOW(), delivered_at),
                updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param("sssssi", $status, $status, $status, $status, $status, $dbId);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            $check = $conn->prepare("SELECT id FROM orders WHERE id = ?");
            $check->bind_param("i", $dbId);
            $check->execute();

            if ($check->get_result()->num_rows === 0) {
                sendJson(404, ["success" => false, "error" => "Order not found"]);
            }
        }

        $result = $conn->prepare("
            SELECT id, name, phone, flat_no, area_street, address_type, address,
                state, district, street, pincode, customization_name, customization_color,
                customization_photo_name, customization_photo_data, customization, delivery_note,
                items, total, offer, payment_method, payment_status, status, making_at, shipped_at, confirmed_at, delivered_at, updated_at, created_at
            FROM orders
            WHERE id = ?
        ");
        $result->bind_param("i", $dbId);
        $result->execute();
        $order = $result->get_result()->fetch_assoc();
        $previousStatus = displayStatus($previousRow["status"] ?? "Pending");
        $nextStatus = displayStatus($order["status"] ?? $status);

        if ($previousStatus !== $nextStatus) {
            addCustomerStatusNotification($conn, $order, $nextStatus);
        }

        sendJson(200, ["success" => true, "order" => orderFromRow($order), "orders" => getOrders($conn)]);
    }

    if ($method === "DELETE") {
        requireAdmin();
        if ($dbId <= 0) {
            sendJson(400, ["success" => false, "error" => "Order ID is required"]);
        }

        $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->bind_param("i", $dbId);
        $stmt->execute();

        sendJson(200, ["success" => true, "orders" => getOrders($conn)]);
    }

    sendJson(405, ["success" => false, "error" => "Method not allowed"]);
} catch (mysqli_sql_exception $error) {
    sendJson(500, ["success" => false, "error" => "Database error"]);
}
?>
