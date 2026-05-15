<?php

include("../db.php");
include("auth.php");

function safeNextUrl($url) {
    if ($url === "" || str_starts_with($url, "http") || str_contains($url, "//")) {
        return "dashboard.php";
    }

    return $url;
}

if (isAdminLoggedIn()) {
    header("Location: dashboard.php");
    exit;
}

$error = "";
$next = safeNextUrl($_GET["next"] ?? "dashboard.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";
    $next = safeNextUrl($_POST["next"] ?? "dashboard.php");

    if ($email === "" || $password === "") {
        $error = "Email and password are required.";
    } else {
        $stmt = mysqli_prepare($conn, "SELECT id, name, email, password FROM admins WHERE email = ?");
        mysqli_stmt_bind_param($stmt, "s", $email);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $admin = mysqli_fetch_assoc($result);

        if ($admin && password_verify($password, $admin["password"])) {
            session_regenerate_id(true);
            $_SESSION["admin_logged_in"] = true;
            $_SESSION["admin_id"] = $admin["id"];
            $_SESSION["admin_name"] = $admin["name"];
            $_SESSION["admin_email"] = $admin["email"];
            $_SESSION["admin_last_login"] = time();

            header("Location: " . $next);
            exit;
        }

        $error = "Invalid admin login.";
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | SmartOrnaments</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            margin: 0;
            display: grid;
            place-items: center;
            background: #f5f5f5;
            color: #1f1f24;
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        .login-card {
            width: min(420px, 100%);
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 12px 34px rgba(0, 0, 0, 0.12);
            padding: 30px;
        }

        h1 {
            margin: 0 0 8px;
            font-size: 28px;
        }

        p {
            margin: 0 0 24px;
            color: #666;
            line-height: 1.5;
        }

        label {
            display: block;
            margin-bottom: 14px;
            font-weight: 700;
        }

        input {
            width: 100%;
            height: 46px;
            margin-top: 8px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 0 12px;
            font-size: 15px;
        }

        input:focus {
            border-color: #ff4d6d;
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.16);
        }

        button {
            width: 100%;
            height: 46px;
            border: 0;
            border-radius: 8px;
            background: #ff4d6d;
            color: #fff;
            cursor: pointer;
            font-size: 15px;
            font-weight: 800;
        }

        .error {
            margin-bottom: 16px;
            border-radius: 8px;
            background: #fff1f3;
            color: #b42352;
            padding: 12px;
            font-weight: 700;
        }

        .success {
            margin-bottom: 16px;
            border-radius: 8px;
            background: #ecfdf3;
            color: #067647;
            padding: 12px;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <main class="login-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage SmartOrnaments products and dashboard.</p>

        <?php if (isset($_GET["logged_out"])) { ?>
            <div class="success">Logged out successfully.</div>
        <?php } ?>

        <?php if ($error !== "") { ?>
            <div class="error"><?php echo htmlspecialchars($error); ?></div>
        <?php } ?>

        <form method="POST">
            <input type="hidden" name="next" value="<?php echo htmlspecialchars($next); ?>">

            <label>
                Admin Email
                <input type="email" name="email" required>
            </label>

            <label>
                Password
                <input type="password" name="password" required>
            </label>

            <button type="submit">Login</button>
        </form>
    </main>
</body>
</html>
