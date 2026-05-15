<?php

include("auth.php");
requireAdminLogin();

function adminSizeToBytes($value) {
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

function adminFormatBytes($bytes) {
    if ($bytes >= 1024 * 1024) {
        return round($bytes / (1024 * 1024), 1) . " MB";
    }

    return round($bytes / 1024) . " KB";
}

$appImageLimit = 5 * 1024 * 1024;
$uploadLimit = adminSizeToBytes(ini_get("upload_max_filesize"));
$postLimit = adminSizeToBytes(ini_get("post_max_size"));
$serverImageLimit = $appImageLimit;

foreach ([$uploadLimit, $postLimit] as $limit) {
    if ($limit > 0) {
        $serverImageLimit = min($serverImageLimit, $limit);
    }
}

$clientImageTarget = min(
    $serverImageLimit,
    max(256 * 1024, min($serverImageLimit - 128 * 1024, (int)floor($serverImageLimit * 0.85)))
);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product | SmartOrnaments</title>
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

        nav div {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        nav a {
            color: #fff;
            text-decoration: none;
            font-weight: 800;
        }

        .logout {
            background: #ff4d6d;
            border-radius: 8px;
            padding: 10px 14px;
        }

        main {
            width: min(620px, calc(100% - 32px));
            margin: 0 auto;
            padding: 30px 0;
        }

        form {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            padding: 24px;
        }

        h2 {
            margin: 0 0 18px;
        }

        input,
        textarea {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            font-size: 15px;
        }

        textarea {
            min-height: 110px;
            resize: vertical;
        }

        button {
            border: 0;
            border-radius: 8px;
            background: #ff4d6d;
            color: #fff;
            cursor: pointer;
            padding: 12px 18px;
            font-weight: 800;
        }

        button:disabled {
            cursor: wait;
            opacity: 0.65;
        }

        .file-note {
            color: #5d5d66;
            font-size: 13px;
            margin: 8px 0 0;
        }

        .upload-status {
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            line-height: 1.4;
            margin: 0 0 16px;
            min-height: 20px;
        }

        .upload-status.error {
            color: #b00020;
        }

        .upload-status.success {
            color: #176b36;
        }
    </style>
</head>
<body>

<nav>
    <h1>SmartOrnaments Admin</h1>
    <div>
        <a href="dashboard.php">Dashboard</a>
        <a class="logout" href="logout.php">Logout</a>
    </div>
</nav>

<main>
    <form id="productForm"
          action="upload-product.php"
          method="POST"
          enctype="multipart/form-data">

    <h2>Add Product</h2>

<input type="text"
       name="name"
       placeholder="Product Name"
       required>

<br><br>

<input type="number"
       name="price"
       placeholder="Price"
       min="1"
       required>

<br><br>

<input type="text"
       name="category"
       placeholder="Category"
       required>

<br><br>

<textarea name="description"
          placeholder="Description"
          required></textarea>

<br><br>

<input type="hidden"
       name="MAX_FILE_SIZE"
       value="<?php echo (int)$clientImageTarget; ?>">

<input type="file"
       id="productImage"
       name="image"
       accept=".jpg,.jpeg,.png,image/jpeg,image/png"
       required>

<p class="file-note">JPG or PNG. Files over <?php echo htmlspecialchars(adminFormatBytes($clientImageTarget), ENT_QUOTES, "UTF-8"); ?> are optimized automatically.</p>

<br><br>

<div class="upload-status" id="uploadStatus" role="status" aria-live="polite"></div>

<button type="submit">
Upload Product
</button>

    </form>
</main>

<script>
(() => {
    const form = document.getElementById("productForm");
    const imageInput = document.getElementById("productImage");
    const status = document.getElementById("uploadStatus");
    const submitButton = form.querySelector("button[type='submit']");
    const imageTargetBytes = <?php echo (int)$clientImageTarget; ?>;
    const imageLimitLabel = <?php echo json_encode(adminFormatBytes($clientImageTarget)); ?>;

    function setStatus(message, type) {
        status.textContent = message;
        status.className = type ? `upload-status ${type}` : "upload-status";
    }

    function isAllowedImage(file) {
        return ["image/jpeg", "image/png"].includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const imageUrl = URL.createObjectURL(file);
            const image = new Image();

            image.onload = () => {
                URL.revokeObjectURL(imageUrl);
                resolve(image);
            };

            image.onerror = () => {
                URL.revokeObjectURL(imageUrl);
                reject(new Error("Could not read the selected image."));
            };

            image.src = imageUrl;
        });
    }

    function canvasToBlob(canvas, quality) {
        return new Promise((resolve) => {
            canvas.toBlob(resolve, "image/jpeg", quality);
        });
    }

    async function compressImage(file) {
        if (file.size <= imageTargetBytes) {
            return file;
        }

        const image = await loadImage(file);
        let maxSide = 1600;
        let bestBlob = null;

        for (let pass = 0; pass < 5; pass += 1) {
            const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));

            const context = canvas.getContext("2d", { alpha: false });
            context.fillStyle = "#fff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            let lowQuality = 0.45;
            let highQuality = 0.88;

            for (let attempt = 0; attempt < 7; attempt += 1) {
                const quality = (lowQuality + highQuality) / 2;
                const blob = await canvasToBlob(canvas, quality);

                if (!blob) {
                    throw new Error("Could not optimize the selected image.");
                }

                if (blob.size > imageTargetBytes) {
                    highQuality = quality;
                } else {
                    lowQuality = quality;
                    bestBlob = blob;
                }
            }

            if (bestBlob && bestBlob.size <= imageTargetBytes) {
                break;
            }

            maxSide = Math.round(maxSide * 0.75);
        }

        if (!bestBlob || bestBlob.size > imageTargetBytes) {
            throw new Error(`That image is too large to optimize. Please choose a JPG or PNG below ${imageLimitLabel}.`);
        }

        const safeName = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^A-Za-z0-9._-]/g, "-") || "product-image";

        return new File([bestBlob], `${safeName}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now()
        });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const file = imageInput.files && imageInput.files[0];

        if (!file) {
            setStatus("Please choose a product image.", "error");
            return;
        }

        if (!isAllowedImage(file)) {
            setStatus("Only JPG and PNG images are allowed.", "error");
            return;
        }

        submitButton.disabled = true;
        setStatus(file.size > imageTargetBytes ? "Optimizing image..." : "Uploading product...", "");

        try {
            const imageFile = await compressImage(file);
            const formData = new FormData(form);
            formData.set("image", imageFile, imageFile.name);
            setStatus("Uploading product...", "");

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });
            const message = (await response.text()).trim() || "Upload finished.";

            if (!response.ok) {
                throw new Error(message);
            }

            form.reset();
            setStatus(message, "success");
        } catch (error) {
            setStatus(error.message || "Image upload failed.", "error");
        } finally {
            submitButton.disabled = false;
        }
    });
})();
</script>

</body>
</html>
