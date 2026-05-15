<?php

include("../db.php");
include("auth.php");

requireAdminLogin();

function tableExists($conn, $table) {
    $stmt = mysqli_prepare(
        $conn,
        "SELECT COUNT(*) AS total
         FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = ?"
    );
    mysqli_stmt_bind_param($stmt, "s", $table);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);

    return (int)$row["total"] > 0;
}

function tableCount($conn, $table) {
    if (!tableExists($conn, $table)) {
        return 0;
    }

    $result = mysqli_query($conn, "SELECT COUNT(*) AS total FROM `$table`");
    $row = mysqli_fetch_assoc($result);

    return (int)$row["total"];
}

$productCount = tableCount($conn, "products");
$orderCount = tableCount($conn, "orders");
$revenue = 0;

if (tableExists($conn, "orders")) {
    $revenueResult = mysqli_query($conn, "SELECT COALESCE(SUM(total), 0) AS revenue FROM orders");
    $revenueRow = mysqli_fetch_assoc($revenueResult);
    $revenue = (int)$revenueRow["revenue"];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | SmartOrnaments</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            background: #f5f5f5;
            color: #1f1f24;
            font-family: Arial, sans-serif;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            background: #111;
            color: #fff;
            padding: 16px 24px;
        }

        nav h1 {
            margin: 0;
            font-size: 22px;
        }

        nav p {
            margin: 4px 0 0;
            color: #ccc;
            font-size: 14px;
        }

        .logout {
            background: #ff4d6d;
            color: #fff;
            border-radius: 8px;
            padding: 10px 16px;
            text-decoration: none;
            font-weight: 800;
            white-space: nowrap;
        }

        main {
            width: min(1100px, calc(100% - 32px));
            margin: 0 auto;
            padding: 30px 0;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 18px;
        }

        .card {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            padding: 22px;
        }

        .card h2 {
            margin: 0 0 10px;
            color: #666;
            font-size: 15px;
        }

        .card p {
            margin: 0;
            color: #ff4d6d;
            font-size: 30px;
            font-weight: 900;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 24px;
        }

        .actions a {
            background: #111;
            color: #fff;
            border-radius: 8px;
            padding: 12px 16px;
            text-decoration: none;
            font-weight: 800;
        }

        .actions a:hover,
        .logout:hover {
            opacity: 0.88;
        }
    </style>
</head>
<body>
    <nav>
        <div>
            <h1>SmartOrnaments Admin</h1>
            <p><?php echo htmlspecialchars(adminEmail()); ?></p>
        </div>
        <a class="logout" href="logout.php">Logout</a>
    </nav>

    <main>
        <section class="cards">
            <div class="card">
                <h2>Products</h2>
                <p><?php echo $productCount; ?></p>
            </div>

            <div class="card">
                <h2>Orders</h2>
                <p><?php echo $orderCount; ?></p>
            </div>

            <div class="card">
                <h2>Revenue</h2>
                <p>Rs. <?php echo $revenue; ?></p>
            </div>
        </section>

        <section class="actions">
            <a href="add-product.php">Add Product</a>
            <a href="../index.php">View Shop</a>
        </section>
    </main>
</body>
</html>
