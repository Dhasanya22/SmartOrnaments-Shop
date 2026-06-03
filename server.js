const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

let mysql;
try {
    mysql = require("mysql2/promise");
} catch (error) {
    console.error("MySQL driver missing. Run npm install before starting the server.");
    process.exit(1);
}

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(ROOT, "data");
const DB_FILE = process.env.DB_FILE
    ? path.resolve(process.env.DB_FILE)
    : path.join(DATA_DIR, "db.json");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "smartornaments.shop@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const LEGACY_ADMIN_USERNAME = "admin";
const OWNER_EMAIL = process.env.OWNER_EMAIL || ADMIN_USERNAME;
const MYSQL_HOST = process.env.MYSQL_HOST || "localhost";
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER || "root";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || process.env.DB_NAME || "smartornaments";
const MYSQL_CONNECTION_LIMIT = Number(process.env.MYSQL_CONNECTION_LIMIT || 10);
const MYSQL_AUTO_MIGRATE = process.env.MYSQL_AUTO_MIGRATE !== "0";
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 24 * 7);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 120);
const rateLimitBuckets = new Map();
let mysqlPool = null;
let dbInitialized = false;
let dbInitializing = null;

function cleanProductDisplayText(value) {
    return String(value || "")
        .replace(/\s*\(\d+\)(?=\s|$)/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function nameFromImagePath(image) {
    return cleanProductDisplayText(String(image || "")
        .split("/")
        .pop()
        .replace(/\.[^.]+$/, "")
        .replace(/\s+/g, " ")
        .trim());
}

function slugFromText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

const categoryLabels = {
    bracelet: "Bracelets",
    "resin-work": "Frames",
    "name-board-fridge-magnet": "Name Boards",
    keychain: "Keychains",
    "hair-accessories": "Hair Accessories",
    "thread-work-bangle-earrings": "Bangles & Earrings",
    "led-gifts": "LED Gifts",
    "couple-gifts": "Couple Gifts"
};

const productSeedGroups = [
    {
        type: "bracelet",
        price: 199,
        description: "Handmade wrist candy with names, charms, and gift-ready sparkle.",
        occasions: ["birthday", "anniversary", "friendship-day", "valentines-day"],
        images: [
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
    },
    {
        type: "resin-work",
        price: 499,
        description: "Glossy keepsake frames that lock your favorite memories in color.",
        occasions: ["birthday", "anniversary", "valentines-day"],
        images: [
            "images/Resin Frame Work/Resin Frame.jpg",
            "images/Resin Frame Work/Resin Frame (2).jpg",
            "images/Resin Frame Work/Resin Frame (3).jpg",
            "images/Resin Frame Work/Resin Frame (4).jpg",
            "images/Resin Frame Work/Resin Frame(3).jpg",
            "images/Resin Frame Work/Resin Frame(4).jpg"
        ]
    },
    {
        type: "name-board-fridge-magnet",
        price: 599,
        description: "Personalized name boards and fridge magnets with a sweet handmade finish.",
        occasions: ["birthday", "anniversary"],
        images: [
            "images/Resin Frame Work/Resin Name Board.jpg"
        ]
    },
    {
        type: "keychain",
        price: 149,
        description: "Tiny daily keepsakes with names, initials, flowers, and color pop.",
        occasions: ["birthday", "friendship-day", "valentines-day"],
        images: [
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
    },
    {
        type: "hair-accessories",
        price: 129,
        description: "Cute clips and bands that make everyday styling feel special.",
        occasions: ["birthday", "friendship-day"],
        images: [
            "images/Accessories/Alligator Clip.jpg",
            "images/Accessories/Centre Clip.jpg",
            "images/Accessories/Hair Band .jpg"
        ]
    },
    {
        type: "thread-work-bangle-earrings",
        price: 159,
        description: "Lightweight statement pieces made for festive looks and quick gifts.",
        occasions: ["birthday", "friendship-day", "valentines-day"],
        images: [
            "images/Accessories/Neck Chain + Braclet.jpg",
            "images/Accessories/Neck Chain.jpg",
            "images/Accessories/Resin Transparent Earrings.jpg"
        ]
    }
];

const defaultProducts = productSeedGroups.flatMap(group => group.images.map((image, index) => {
    const name = nameFromImagePath(image);

    return {
        id: `${group.type}-${slugFromText(name)}-${index + 1}`,
        name,
        price: group.price,
        image,
        images: [image],
        type: group.type,
        category: categoryLabels[group.type] || "Product",
        description: `${group.description} Choose the ${name} design and personalize it your way.`,
        stock: 20,
        rating: Number((4.6 + (index % 4) / 10).toFixed(1)),
        featured: index === 0,
        occasions: group.occasions
    };
}));

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    const [salt] = stored.split(":");
    return hashPassword(password, salt) === stored;
}

function baseDb() {
    return {
        users: [
            {
                id: "admin",
                username: ADMIN_USERNAME,
                passwordHash: hashPassword(ADMIN_PASSWORD),
                role: "admin",
                loginAliases: [ADMIN_USERNAME, LEGACY_ADMIN_USERNAME]
            }
        ],
        sessions: [],
        products: defaultProducts,
        orders: [],
        contacts: [],
        notifications: [],
        wishlists: [],
        reviews: [],
        analyticsEvents: [],
        lastOrderNumber: 1000
    };
}

function sqlId(value) {
    if (!/^[A-Za-z0-9_]+$/.test(value || "")) {
        throw new Error("Invalid MySQL identifier: " + value);
    }

    return "`" + value + "`";
}

function parseStoredJson(value, fallback = {}) {
    if (!value) return fallback;

    try {
        return typeof value === "string" ? JSON.parse(value) : value;
    } catch (error) {
        return fallback;
    }
}

function normalizeDbShape(source = {}) {
    const db = { ...source };
    let changed = false;

    ["users", "sessions", "orders", "contacts", "notifications", "wishlists", "reviews", "analyticsEvents"].forEach(key => {
        if (!Array.isArray(db[key])) {
            db[key] = [];
            changed = true;
        }
    });

    if (!Array.isArray(db.products)) {
        db.products = defaultProducts;
        changed = true;
    }

    const normalizedProducts = db.products.map(product => normalizeProduct(product, product));
    if (normalizedProducts.length && normalizedProducts.every(product => Number(product.stock || 0) <= 0)) {
        normalizedProducts.forEach(product => {
            product.stock = 20;
        });
    }
    if (JSON.stringify(normalizedProducts) !== JSON.stringify(db.products)) {
        db.products = normalizedProducts;
        changed = true;
    }

    if (!Number(db.lastOrderNumber)) {
        db.lastOrderNumber = 1000;
        changed = true;
    }

    ["contacts", "notifications", "reviews", "analyticsEvents"].forEach(key => {
        db[key].forEach(item => {
            if (!item.id) {
                item.id = crypto.randomUUID();
                changed = true;
            }
        });
    });

    db.wishlists = db.wishlists
        .filter(item => item && item.userId)
        .map(item => ({
            ...item,
            productIds: Array.isArray(item.productIds) ? item.productIds : [],
            updatedAt: item.updatedAt || new Date().toISOString()
        }));

    let adminUser = db.users.find(user =>
        user.role === "admin"
        && (
            user.id === "admin"
            || String(user.username || "").toLowerCase() === ADMIN_USERNAME.toLowerCase()
            || String(user.username || "").toLowerCase() === LEGACY_ADMIN_USERNAME
        )
    );

    if (!adminUser) {
        adminUser = {
            id: "admin",
            username: ADMIN_USERNAME,
            passwordHash: hashPassword(ADMIN_PASSWORD),
            role: "admin",
            loginAliases: [ADMIN_USERNAME, LEGACY_ADMIN_USERNAME]
        };
        db.users.push(adminUser);
        changed = true;
    }

    const aliases = new Set([
        ...(Array.isArray(adminUser.loginAliases) ? adminUser.loginAliases : []),
        ADMIN_USERNAME,
        LEGACY_ADMIN_USERNAME
    ].map(value => String(value || "").toLowerCase()).filter(Boolean));

    const nextAliases = Array.from(aliases);
    if (JSON.stringify(adminUser.loginAliases || []) !== JSON.stringify(nextAliases)) {
        adminUser.loginAliases = nextAliases;
        changed = true;
    }

    if (adminUser.id === "admin" && adminUser.username !== ADMIN_USERNAME) {
        adminUser.username = ADMIN_USERNAME;
        changed = true;
    }

    return { db, changed };
}

function readLegacyJsonDb() {
    if (!fs.existsSync(DB_FILE)) return null;

    try {
        return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    } catch (error) {
        console.warn(`Could not read legacy JSON DB at ${DB_FILE}: ${error.message}`);
        return null;
    }
}

function toSqlDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 19).replace("T", " ");
}

async function ensureDb() {
    if (dbInitialized) return;
    if (dbInitializing) return dbInitializing;

    dbInitializing = (async () => {
        await createMysqlPool();
        await createMysqlTables();
        dbInitialized = true;

        if (MYSQL_AUTO_MIGRATE) {
            await migrateLegacyJsonDb();
        }
    })();

    try {
        await dbInitializing;
    } finally {
        dbInitializing = null;
    }
}

async function createMysqlPool() {
    if (mysqlPool) return;

    const connection = await mysql.createConnection({
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD
    });

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS ${sqlId(MYSQL_DATABASE)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.end();

    mysqlPool = mysql.createPool({
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: MYSQL_CONNECTION_LIMIT,
        charset: "utf8mb4"
    });
}

async function createMysqlTables() {
    const tableSql = [
        `CREATE TABLE IF NOT EXISTS app_users (
            id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            username VARCHAR(190),
            role VARCHAR(30),
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_app_users_username (username),
            INDEX idx_app_users_role (role)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_sessions (
            token VARCHAR(128) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            user_id VARCHAR(64),
            expires_at DATETIME NULL,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_app_sessions_user (user_id),
            INDEX idx_app_sessions_expires (expires_at)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_products (
            id VARCHAR(120) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            name VARCHAR(255),
            type VARCHAR(100),
            category VARCHAR(120),
            price DECIMAL(12,2) NOT NULL DEFAULT 0,
            stock INT NOT NULL DEFAULT 0,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_app_products_name (name),
            INDEX idx_app_products_type (type),
            INDEX idx_app_products_category (category)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_orders (
            id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            user_id VARCHAR(64),
            status VARCHAR(40),
            total DECIMAL(12,2) NOT NULL DEFAULT 0,
            created_sort DATETIME NULL,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_app_orders_user (user_id),
            INDEX idx_app_orders_status (status)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_contacts (
            id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_notifications (
            id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            type VARCHAR(40),
            is_read TINYINT(1) NOT NULL DEFAULT 0,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_app_notifications_type (type),
            INDEX idx_app_notifications_read (is_read)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_wishlists (
            user_id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_reviews (
            id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            product_id VARCHAR(120),
            user_id VARCHAR(64),
            rating TINYINT,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_app_reviews_product (product_id)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_analytics_events (
            id VARCHAR(64) PRIMARY KEY,
            position INT NOT NULL DEFAULT 0,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS app_meta (
            name VARCHAR(64) PRIMARY KEY,
            value LONGTEXT NOT NULL
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    ];

    for (const statement of tableSql) {
        await mysqlPool.query(statement);
    }
}

async function migrateLegacyJsonDb() {
    const [rows] = await mysqlPool.query(`
        SELECT
            (SELECT COUNT(*) FROM app_users) AS usersCount,
            (SELECT COUNT(*) FROM app_products) AS productsCount,
            (SELECT COUNT(*) FROM app_orders) AS ordersCount
    `);
    const counts = rows[0] || {};

    if (Number(counts.usersCount) || Number(counts.productsCount) || Number(counts.ordersCount)) {
        return;
    }

    const legacy = readLegacyJsonDb();
    const { db } = normalizeDbShape(legacy || baseDb());
    await persistDb(db);

    if (legacy) {
        console.log(`Imported existing JSON data from ${DB_FILE} into MySQL database ${MYSQL_DATABASE}.`);
    }
}

async function readDocuments(table) {
    const [rows] = await mysqlPool.query(`SELECT data FROM ${sqlId(table)} ORDER BY position ASC`);
    return rows.map(row => parseStoredJson(row.data, {})).filter(Boolean);
}

async function readDb() {
    await ensureDb();

    const [users, sessions, products, orders, contacts, notifications, wishlists, reviews, analyticsEvents, metaRows] = await Promise.all([
        readDocuments("app_users"),
        readDocuments("app_sessions"),
        readDocuments("app_products"),
        readDocuments("app_orders"),
        readDocuments("app_contacts"),
        readDocuments("app_notifications"),
        readDocuments("app_wishlists"),
        readDocuments("app_reviews"),
        readDocuments("app_analytics_events"),
        mysqlPool.query("SELECT name, value FROM app_meta")
    ]);
    const meta = Object.fromEntries((metaRows[0] || []).map(row => [row.name, row.value]));
    const { db, changed } = normalizeDbShape({
        users,
        sessions,
        products,
        orders,
        contacts,
        notifications,
        wishlists,
        reviews,
        analyticsEvents,
        lastOrderNumber: Number(meta.lastOrderNumber || 1000)
    });

    if (changed) {
        await persistDb(db);
    }

    return db;
}

async function writeDb(db) {
    await ensureDb();
    const normalized = normalizeDbShape(db).db;
    await persistDb(normalized);
}

async function persistDb(db) {
    const connection = await mysqlPool.getConnection();

    try {
        await connection.beginTransaction();
        await connection.query("DELETE FROM app_meta");
        await connection.query("DELETE FROM app_analytics_events");
        await connection.query("DELETE FROM app_reviews");
        await connection.query("DELETE FROM app_wishlists");
        await connection.query("DELETE FROM app_notifications");
        await connection.query("DELETE FROM app_contacts");
        await connection.query("DELETE FROM app_orders");
        await connection.query("DELETE FROM app_products");
        await connection.query("DELETE FROM app_sessions");
        await connection.query("DELETE FROM app_users");

        await persistUsers(connection, db.users);
        await persistSessions(connection, db.sessions);
        await persistProducts(connection, db.products);
        await persistOrders(connection, db.orders);
        await persistSimpleDocuments(connection, "app_contacts", "id", db.contacts);
        await persistNotifications(connection, db.notifications);
        await persistWishlists(connection, db.wishlists);
        await persistReviews(connection, db.reviews);
        await persistSimpleDocuments(connection, "app_analytics_events", "id", db.analyticsEvents);
        await connection.query("INSERT INTO app_meta (name, value) VALUES (?, ?)", ["lastOrderNumber", String(db.lastOrderNumber || 1000)]);
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function persistUsers(connection, users = []) {
    for (const [index, user] of users.entries()) {
        await connection.query(
            "INSERT INTO app_users (id, position, username, role, data) VALUES (?, ?, ?, ?, ?)",
            [user.id, index, user.username || user.email || "", user.role || "customer", JSON.stringify(user)]
        );
    }
}

async function persistSessions(connection, sessions = []) {
    for (const [index, session] of sessions.entries()) {
        await connection.query(
            "INSERT INTO app_sessions (token, position, user_id, expires_at, data) VALUES (?, ?, ?, ?, ?)",
            [session.token, index, session.userId || "", toSqlDate(session.expiresAt), JSON.stringify(session)]
        );
    }
}

async function persistProducts(connection, products = []) {
    for (const [index, product] of products.entries()) {
        await connection.query(
            "INSERT INTO app_products (id, position, name, type, category, price, stock, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                product.id,
                index,
                product.name || "",
                product.type || "",
                product.category || "",
                Number(product.price || 0),
                Number(product.stock || 0),
                JSON.stringify(product)
            ]
        );
    }
}

async function persistOrders(connection, orders = []) {
    for (const [index, order] of orders.entries()) {
        await connection.query(
            "INSERT INTO app_orders (id, position, user_id, status, total, created_sort, data) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                order.id,
                index,
                order.userId || "",
                order.status || "",
                Number(order.total || 0),
                toSqlDate(order.createdAt || order.date || order.placedAt),
                JSON.stringify(order)
            ]
        );
    }
}

async function persistNotifications(connection, notifications = []) {
    for (const [index, notification] of notifications.entries()) {
        await connection.query(
            "INSERT INTO app_notifications (id, position, type, is_read, data) VALUES (?, ?, ?, ?, ?)",
            [
                notification.id,
                index,
                notification.type || "",
                notification.read ? 1 : 0,
                JSON.stringify(notification)
            ]
        );
    }
}

async function persistWishlists(connection, wishlists = []) {
    for (const [index, wishlist] of wishlists.entries()) {
        await connection.query(
            "INSERT INTO app_wishlists (user_id, position, data) VALUES (?, ?, ?)",
            [wishlist.userId, index, JSON.stringify(wishlist)]
        );
    }
}

async function persistReviews(connection, reviews = []) {
    for (const [index, review] of reviews.entries()) {
        await connection.query(
            "INSERT INTO app_reviews (id, position, product_id, user_id, rating, data) VALUES (?, ?, ?, ?, ?, ?)",
            [
                review.id,
                index,
                review.productId || "",
                review.userId || "",
                Number(review.rating || 0),
                JSON.stringify(review)
            ]
        );
    }
}

async function persistSimpleDocuments(connection, table, key, docs = []) {
    for (const [index, doc] of docs.entries()) {
        await connection.query(
            `INSERT INTO ${sqlId(table)} (${sqlId(key)}, position, data) VALUES (?, ?, ?)`,
            [doc[key], index, JSON.stringify(doc)]
        );
    }
}

function isPathInside(parent, target) {
    const relative = path.relative(parent, target);
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function securityHeaders(contentType = "text/plain") {
    return {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Cross-Origin-Opener-Policy": "same-origin"
    };
}

function sendJson(res, status, data) {
    res.writeHead(status, securityHeaders("application/json"));
    res.end(JSON.stringify(data));
}

function requestIp(req) {
    return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local").split(",")[0].trim();
}

function isRateLimited(req) {
    const key = requestIp(req);
    const now = Date.now();
    const bucket = rateLimitBuckets.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

    if (now > bucket.resetAt) {
        bucket.count = 0;
        bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
    }

    bucket.count += 1;
    rateLimitBuckets.set(key, bucket);

    return bucket.count > RATE_LIMIT_MAX;
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
            if (body.length > 5_000_000) req.destroy();
        });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
}

function getSession(req, db) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const session = db.sessions.find(item => item.token === token);
    if (!session) return null;

    if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
        return null;
    }

    const user = db.users.find(item => item.id === session.userId);
    return user ? { token, user } : null;
}

function requireUser(req, res, db) {
    const session = getSession(req, db);
    if (!session) {
        sendJson(res, 401, { error: "Login required" });
        return null;
    }
    return session;
}

function requireAdmin(req, res, db) {
    const session = requireUser(req, res, db);
    if (!session) return null;
    if (session.user.role !== "admin") {
        sendJson(res, 403, { error: "Admin access required" });
        return null;
    }
    return session;
}

function publicUser(user) {
    return {
        id: user.id,
        username: user.username,
        role: user.role
    };
}

function matchesLogin(user, username) {
    const login = String(username || "").toLowerCase();
    const aliases = Array.isArray(user.loginAliases) ? user.loginAliases : [];

    return String(user.username || "").toLowerCase() === login
        || String(user.email || "").toLowerCase() === login
        || aliases.some(alias => String(alias || "").toLowerCase() === login);
}

function nextOrderId(db) {
    db.lastOrderNumber = Number(db.lastOrderNumber || 1000) + 1;
    return "SO-" + db.lastOrderNumber;
}

function cleanText(value) {
    return String(value || "").trim();
}

function clampNumber(value, fallback = 0, min = 0, max = Number.POSITIVE_INFINITY) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.min(Math.max(number, min), max);
}

function normalizeProduct(product = {}, existing = {}) {
    const rawImages = [
        product.image,
        ...(Array.isArray(product.images) ? product.images : [])
    ].map(image => cleanText(image)).filter(Boolean);
    const images = Array.from(new Set(rawImages)).slice(0, 10);
    const type = cleanText(product.type || existing.type || "keychain");
    const category = cleanText(product.category || existing.category || categoryLabels[type] || "Product");
    const now = new Date().toISOString();

    return {
        id: cleanText(product.id || existing.id) || crypto.randomUUID(),
        name: cleanText(product.name || existing.name),
        price: clampNumber(product.price ?? existing.price, 0, 0),
        image: images[0] || cleanText(existing.image),
        images: images.length ? images : cleanText(existing.image) ? [cleanText(existing.image)] : [],
        type,
        category,
        description: cleanText(product.description ?? existing.description),
        stock: Math.floor(clampNumber(product.stock ?? existing.stock, 0, 0)),
        rating: clampNumber(product.rating ?? existing.rating, 0, 0, 5),
        featured: Boolean(product.featured ?? existing.featured),
        occasions: Array.isArray(product.occasions) ? product.occasions : Array.isArray(existing.occasions) ? existing.occasions : [],
        createdAt: existing.createdAt || product.createdAt || now,
        updatedAt: existing.updatedAt || product.updatedAt || now
    };
}

function normalizeOrderItem(item = {}) {
    const qty = Math.max(Number(item.qty || 1), 1);

    return {
        productId: cleanText(item.productId || item.id),
        name: cleanText(item.name),
        price: clampNumber(item.price, 0, 0),
        qty,
        image: cleanText(item.image),
        category: cleanText(item.category),
        customization: item.customization || {}
    };
}

function reduceProductInventory(products, items) {
    for (const item of items) {
        const product = products.find(candidate =>
            (item.productId && candidate.id === item.productId)
            || cleanText(candidate.name).toLowerCase() === cleanText(item.name).toLowerCase()
        );

        if (!product) {
            continue;
        }

        const qty = Number(item.qty || 1);
        const stock = Number(product.stock || 0);

        if (stock < qty) {
            return `${product.name} has only ${stock} left in stock`;
        }

        product.stock = stock - qty;
        product.updatedAt = new Date().toISOString();
    }

    return "";
}

function addNotification(db, type, title, message, meta = {}) {
    const notification = {
        id: crypto.randomUUID(),
        type,
        title,
        message,
        meta,
        read: false,
        createdAt: new Date().toISOString()
    };

    db.notifications.unshift(notification);
    db.notifications = db.notifications.slice(0, 100);

    return notification;
}

function summarizeOrder(order) {
    const customerName = cleanText(order.customer?.name) || "Customer";
    const total = Number(order.total || 0);
    return `${customerName} placed ${order.id} for Rs. ${total}`;
}

const orderStatuses = ["Pending", "Making", "Shipped", "Delivered"];

function normalizeOrderStatus(status) {
    if (status === "Confirmed") return "Making";
    return orderStatuses.includes(status) ? status : "Pending";
}

function orderStatusTimeField(status) {
    if (status === "Making") return "makingAt";
    if (status === "Shipped") return "shippedAt";
    if (status === "Delivered") return "deliveredAt";
    return "placedAt";
}

function bestSellerFromOrders(orders, products) {
    const totals = new Map();

    for (const order of orders || []) {
        for (const item of order.items || []) {
            const name = cleanText(item.name);
            if (!name) continue;

            const key = name.toLowerCase();
            const current = totals.get(key) || { name, quantity: 0 };
            current.quantity += Number(item.qty || 1);
            totals.set(key, current);
        }
    }

    const best = Array.from(totals.values()).sort((a, b) => b.quantity - a.quantity)[0];
    if (!best) return null;

    const product = (products || []).find(item => cleanText(item.name).toLowerCase() === best.name.toLowerCase());
    return { ...best, product };
}

function productReviews(productId, reviews = []) {
    return reviews.filter(review => cleanText(review.productId) === cleanText(productId));
}

function productReviewStats(productId, reviews = []) {
    const ratings = productReviews(productId, reviews)
        .map(review => Number(review.rating))
        .filter(rating => Number.isFinite(rating) && rating > 0);

    if (ratings.length === 0) {
        return { average: 0, count: 0 };
    }

    return {
        average: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
        count: ratings.length
    };
}

function productWithReviewStats(product, reviews = []) {
    const stats = productReviewStats(product.id, reviews);

    return {
        ...product,
        rating: stats.count ? Number(stats.average.toFixed(1)) : product.rating,
        reviewCount: stats.count
    };
}

function topProductsFromOrders(orders = []) {
    const totals = new Map();

    for (const order of orders) {
        for (const item of order.items || []) {
            const name = cleanText(item.name) || "Product";
            const current = totals.get(name.toLowerCase()) || { name, quantity: 0, revenue: 0 };
            current.quantity += Number(item.qty || 1);
            current.revenue += Number(item.price || 0) * Number(item.qty || 1);
            totals.set(name.toLowerCase(), current);
        }
    }

    return Array.from(totals.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
}

const aiProfiles = {
    birthday: {
        keywords: ["birthday", "surprise", "custom", "name", "photo", "girlfriend", "boyfriend"],
        types: ["led-gifts", "resin-work", "keychain", "bracelet", "name-board-fridge-magnet"]
    },
    anniversary: {
        keywords: ["anniversary", "love", "couple", "romantic", "wife", "husband", "girlfriend", "boyfriend"],
        types: ["couple-gifts", "resin-work", "bracelet", "name-board-fridge-magnet"]
    },
    "friendship-day": {
        keywords: ["friend", "friendship", "bestie", "best friend", "band"],
        types: ["bracelet", "keychain", "thread-work-bangle-earrings"]
    },
    wedding: {
        keywords: ["wedding", "couple", "bride", "groom", "marriage"],
        types: ["resin-work", "name-board-fridge-magnet", "couple-gifts", "bracelet"]
    }
};

function normalizeAiOccasion(value = "") {
    const clean = String(value || "").toLowerCase();
    if (clean.includes("wedding") || clean.includes("marriage")) return "wedding";
    if (clean.includes("anniversary") || clean.includes("couple") || clean.includes("love") || clean.includes("girlfriend") || clean.includes("boyfriend")) return "anniversary";
    if (clean.includes("friend")) return "friendship-day";
    if (clean.includes("birthday") || clean.includes("bday")) return "birthday";
    return aiProfiles[clean] ? clean : "";
}

function extractBudget(value = "") {
    const clean = String(value || "").replace(/,/g, "");
    const match = clean.match(/(?:under|below|within|up to|upto|budget|rs\.?|inr|₹)?\s*(\d{3,6})/i);
    return match ? Number(match[1]) : 0;
}

function scoreRecommendation(product, { query = "", occasion = "", budget = 0 } = {}) {
    const normalizedOccasion = normalizeAiOccasion(occasion) || normalizeAiOccasion(query);
    const normalizedBudget = Number(budget || extractBudget(query) || 0);
    const profile = aiProfiles[normalizedOccasion];
    const haystack = [
        product.name,
        product.description,
        product.category,
        product.type,
        ...(Array.isArray(product.occasions) ? product.occasions : [])
    ].join(" ").toLowerCase();
    let score = 0;

    if (normalizedBudget > 0) {
        if (Number(product.price || 0) <= normalizedBudget) score += 5;
        else if (Number(product.price || 0) <= normalizedBudget * 1.15) score += 1;
        else score -= 6;
    }

    if (profile) {
        if (profile.types.includes(product.type)) score += 4;
        profile.keywords.forEach(keyword => {
            if (haystack.includes(keyword)) score += 2;
        });
    }

    String(query || "").toLowerCase().split(/[^a-z0-9]+/).filter(token => token.length > 2).forEach(token => {
        if (haystack.includes(token)) score += 1;
    });

    if (product.featured) score += 1;
    score += Number(product.rating || 0) / 10;
    if (Number(product.stock || 0) <= 0) score -= 20;

    return score;
}

function recommendedProducts(products, intent) {
    return products
        .map(product => ({ product, score: scoreRecommendation(product, intent) }))
        .filter(item => item.score > -2)
        .sort((a, b) => b.score - a.score || Number(a.product.price || 0) - Number(b.product.price || 0))
        .slice(0, 6)
        .map(item => item.product);
}

function chatbotReply(message, db) {
    const text = String(message || "").toLowerCase();
    const bestSeller = bestSellerFromOrders(db.orders, db.products);

    if (text.includes("delivery") || text.includes("ship")) {
        return "Delivery usually takes 5-7 business days after customization confirmation.";
    }

    if (text.includes("seller") || text.includes("popular") || text.includes("best")) {
        return bestSeller?.name
            ? `Current best seller: ${bestSeller.name} with ${bestSeller.quantity} orders.`
            : "Popular picks are custom keychains, resin frames, and couple bracelets.";
    }

    if (text.includes("custom") || text.includes("name") || text.includes("photo")) {
        return "Yes. Customers can add name, color, photo, and gift notes before checkout.";
    }

    if (text.includes("birthday") || text.includes("friend") || text.includes("anniversary") || text.includes("wedding") || text.includes("gift")) {
        const picks = recommendedProducts(db.products, { query: message }).slice(0, 3);
        return picks.length
            ? "Gift suggestions: " + picks.map(product => `${product.name} (Rs. ${product.price})`).join(", ") + "."
            : "Tell me the occasion and budget, like birthday gift under Rs. 1000.";
    }

    return "I can help with best sellers, delivery time, birthday suggestions, wishlist, and personalization.";
}

function normalizeContact(body) {
    const contact = {
        id: crypto.randomUUID(),
        name: cleanText(body.name),
        email: cleanText(body.email),
        phone: cleanText(body.phone),
        subject: cleanText(body.subject) || "Contact form",
        message: cleanText(body.message),
        status: "New",
        createdAt: new Date().toISOString()
    };

    if (!contact.name || !contact.message || (!contact.email && !contact.phone)) {
        return { error: "Name, message, and email or phone are required" };
    }

    return { contact };
}

function serveStatic(req, res) {
    const requestPath = decodeURIComponent(req.url.split("?")[0]);
    const safePath = requestPath === "/"
        ? "/index.html"
        : /^\/products\/[^/]+$/i.test(requestPath)
        ? "/product.html"
        : requestPath;
    const segments = safePath.split("/").filter(Boolean);
    const filePath = path.normalize(path.join(ROOT, safePath));

    const blockedTopLevel = new Set(["data", "node_modules"]);
    const blockedPath = segments.some(segment => segment.startsWith("."))
        || blockedTopLevel.has(segments[0])
        || isPathInside(DATA_DIR, filePath);

    if (!isPathInside(ROOT, filePath) || blockedPath) {
        res.writeHead(403, securityHeaders("text/plain"));
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, securityHeaders("text/plain"));
            res.end("Not found");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const types = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".json": "application/json",
            ".webmanifest": "application/manifest+json",
            ".xml": "application/xml",
            ".txt": "text/plain",
            ".jpeg": "image/jpeg",
            ".jpg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".svg": "image/svg+xml"
        };

        res.writeHead(200, securityHeaders(types[ext] || "application/octet-stream"));
        res.end(content);
    });
}

async function handleApi(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    try {
        const db = await readDb();

        if (req.method === "POST" && url.pathname === "/api/signup") {
            const body = await parseBody(req);
            const username = String(body.username || "").trim();
            const password = String(body.password || "");

            if (!username || !password) return sendJson(res, 400, { error: "Username and password are required" });
            if (db.users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
                return sendJson(res, 409, { error: "Username already exists" });
            }

            const user = {
                id: crypto.randomUUID(),
                username,
                passwordHash: hashPassword(password),
                role: "customer"
            };
            db.users.push(user);
            await writeDb(db);
            return sendJson(res, 201, { user: publicUser(user) });
        }

        if (req.method === "POST" && url.pathname === "/api/login") {
            const body = await parseBody(req);
            const username = String(body.username || body.email || "").trim();
            const password = String(body.password || "");
            const user = db.users.find(item => matchesLogin(item, username));

            if (!user || !verifyPassword(password, user.passwordHash)) {
                return sendJson(res, 401, { error: "Invalid login" });
            }

            const token = crypto.randomBytes(32).toString("hex");
            const now = Date.now();
            db.sessions = db.sessions.filter(item => !item.expiresAt || new Date(item.expiresAt).getTime() > now);
            db.sessions.push({
                token,
                userId: user.id,
                createdAt: new Date(now).toISOString(),
                expiresAt: new Date(now + SESSION_TTL_MS).toISOString()
            });
            await writeDb(db);
            return sendJson(res, 200, { token, user: publicUser(user), expiresAt: db.sessions[db.sessions.length - 1].expiresAt });
        }

        if (req.method === "POST" && url.pathname === "/api/logout") {
            const session = getSession(req, db);
            if (session) {
                db.sessions = db.sessions.filter(item => item.token !== session.token);
                await writeDb(db);
            }
            return sendJson(res, 200, { ok: true });
        }

        if (req.method === "GET" && url.pathname === "/api/users") {
            if (!requireAdmin(req, res, db)) return;
            return sendJson(res, 200, { users: db.users.map(publicUser) });
        }

        if (req.method === "POST" && url.pathname === "/api/contact") {
            const body = await parseBody(req);
            const { contact, error } = normalizeContact(body);

            if (error) return sendJson(res, 400, { error });

            db.contacts.unshift(contact);
            const notification = addNotification(
                db,
                "contact",
                "New contact message",
                `${contact.name} sent a message: ${contact.subject}`,
                { contactId: contact.id }
            );
            await writeDb(db);
            return sendJson(res, 201, { contact, notification, ownerEmail: OWNER_EMAIL });
        }

        if (req.method === "GET" && url.pathname === "/api/contacts") {
            if (!requireAdmin(req, res, db)) return;
            return sendJson(res, 200, { contacts: db.contacts });
        }

        if (req.method === "GET" && url.pathname === "/api/products") {
            return sendJson(res, 200, {
                products: db.products.map(product => productWithReviewStats(product, db.reviews))
            });
        }

        if (req.method === "GET" && url.pathname === "/api/stats") {
            const bestSeller = bestSellerFromOrders(db.orders, db.products);
            const reviewRatings = db.reviews.map(review => Number(review.rating)).filter(rating => Number.isFinite(rating) && rating > 0);
            return sendJson(res, 200, {
                bestSeller,
                topProducts: topProductsFromOrders(db.orders),
                totalOrders: db.orders.length,
                revenue: db.orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
                productsCount: db.products.length,
                usersCount: db.users.length,
                wishlistCount: db.wishlists.reduce((sum, wishlist) => sum + (Array.isArray(wishlist.productIds) ? wishlist.productIds.length : 0), 0),
                averageRating: reviewRatings.length
                    ? Number((reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length).toFixed(1))
                    : 0
            });
        }

        if (req.method === "POST" && url.pathname === "/api/ai/recommend") {
            const body = await parseBody(req);
            return sendJson(res, 200, {
                products: recommendedProducts(db.products.map(product => productWithReviewStats(product, db.reviews)), body)
            });
        }

        if (req.method === "POST" && url.pathname === "/api/ai/chat") {
            const body = await parseBody(req);
            return sendJson(res, 200, { reply: chatbotReply(body.message, db) });
        }

        if (req.method === "POST" && url.pathname === "/api/products") {
            if (!requireAdmin(req, res, db)) return;
            const product = normalizeProduct(await parseBody(req));

            if (!product.name || product.price <= 0 || !product.image) {
                return sendJson(res, 400, { error: "Product name, price, and image are required" });
            }

            db.products.push(product);
            addNotification(
                db,
                "product",
                "Product added",
                `${product.name || "Product"} was added to the shop`,
                { productId: product.id }
            );
            await writeDb(db);
            return sendJson(res, 201, { product });
        }

        const productMatch = url.pathname.match(/^\/api\/products\/([^/]+)$/);
        if (productMatch && req.method === "GET") {
            const id = productMatch[1];
            const product = db.products.find(item => item.id === id);

            if (!product) return sendJson(res, 404, { error: "Product not found" });

            return sendJson(res, 200, { product: productWithReviewStats(product, db.reviews) });
        }

        if (productMatch && req.method === "PUT") {
            if (!requireAdmin(req, res, db)) return;
            const id = productMatch[1];
            const index = db.products.findIndex(item => item.id === id);
            if (index < 0) return sendJson(res, 404, { error: "Product not found" });
            const product = normalizeProduct({ ...(await parseBody(req)), id }, db.products[index]);
            product.updatedAt = new Date().toISOString();

            if (!product.name || product.price <= 0 || !product.image) {
                return sendJson(res, 400, { error: "Product name, price, and image are required" });
            }

            db.products[index] = product;
            addNotification(
                db,
                "product",
                "Product updated",
                `${db.products[index].name || "Product"} was updated`,
                { productId: id }
            );
            await writeDb(db);
            return sendJson(res, 200, { product: db.products[index] });
        }

        if (productMatch && req.method === "DELETE") {
            if (!requireAdmin(req, res, db)) return;
            const id = productMatch[1];
            const product = db.products.find(item => item.id === id);
            if (!product) return sendJson(res, 404, { error: "Product not found" });
            db.products = db.products.filter(item => item.id !== id);
            addNotification(
                db,
                "product",
                "Product deleted",
                `${product?.name || "Product"} was removed from the shop`,
                { productId: id }
            );
            await writeDb(db);
            return sendJson(res, 200, { ok: true });
        }

        if (req.method === "GET" && url.pathname === "/api/wishlist") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const wishlist = db.wishlists.find(item => item.userId === session.user.id) || { userId: session.user.id, productIds: [] };
            const products = db.products
                .filter(product => wishlist.productIds.includes(product.id))
                .map(product => productWithReviewStats(product, db.reviews));
            return sendJson(res, 200, { productIds: wishlist.productIds, products });
        }

        if (req.method === "POST" && url.pathname === "/api/wishlist") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const body = await parseBody(req);
            const productId = cleanText(body.productId);
            const product = db.products.find(item => item.id === productId);

            if (!product) return sendJson(res, 404, { error: "Product not found" });

            let wishlist = db.wishlists.find(item => item.userId === session.user.id);
            if (!wishlist) {
                wishlist = { userId: session.user.id, productIds: [], updatedAt: new Date().toISOString() };
                db.wishlists.push(wishlist);
            }

            if (!wishlist.productIds.includes(productId)) wishlist.productIds.push(productId);
            wishlist.updatedAt = new Date().toISOString();
            await writeDb(db);
            return sendJson(res, 200, { productIds: wishlist.productIds });
        }

        const wishlistMatch = url.pathname.match(/^\/api\/wishlist\/([^/]+)$/);
        if (wishlistMatch && req.method === "DELETE") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const productId = wishlistMatch[1];
            const wishlist = db.wishlists.find(item => item.userId === session.user.id);

            if (wishlist) {
                wishlist.productIds = wishlist.productIds.filter(id => id !== productId);
                wishlist.updatedAt = new Date().toISOString();
                await writeDb(db);
            }

            return sendJson(res, 200, { productIds: wishlist?.productIds || [] });
        }

        const productReviewMatch = url.pathname.match(/^\/api\/products\/([^/]+)\/reviews$/);
        if (productReviewMatch && req.method === "GET") {
            const productId = productReviewMatch[1];
            return sendJson(res, 200, {
                reviews: productReviews(productId, db.reviews),
                stats: productReviewStats(productId, db.reviews)
            });
        }

        if (productReviewMatch && req.method === "POST") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const productId = productReviewMatch[1];
            const product = db.products.find(item => item.id === productId);
            const body = await parseBody(req);
            const rating = clampNumber(body.rating, 5, 1, 5);
            const comment = cleanText(body.comment);

            if (!product) return sendJson(res, 404, { error: "Product not found" });
            if (!comment) return sendJson(res, 400, { error: "Review comment is required" });

            const review = {
                id: crypto.randomUUID(),
                productId,
                userId: session.user.id,
                user: session.user.username,
                rating,
                comment,
                createdAt: new Date().toLocaleString()
            };

            db.reviews.push(review);
            addNotification(db, "review", "New product review", `${session.user.username} reviewed ${product.name}`, { productId, reviewId: review.id });
            await writeDb(db);
            return sendJson(res, 201, { review, stats: productReviewStats(productId, db.reviews) });
        }

        if (req.method === "GET" && url.pathname === "/api/orders") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const orders = session.user.role === "admin"
                ? db.orders
                : db.orders.filter(order => order.userId === session.user.id);
            return sendJson(res, 200, { orders });
        }

        if (req.method === "POST" && url.pathname === "/api/orders") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const body = await parseBody(req);
            const items = (Array.isArray(body.items) ? body.items : []).map(normalizeOrderItem).filter(item => item.name && item.price > 0);

            if (items.length === 0) {
                return sendJson(res, 400, { error: "Order items are required" });
            }

            const inventoryError = reduceProductInventory(db.products, items);
            if (inventoryError) {
                return sendJson(res, 400, { error: inventoryError });
            }

            const order = {
                ...body,
                items,
                id: nextOrderId(db),
                userId: session.user.id,
                date: new Date().toLocaleString(),
                status: "Pending",
                placedAt: new Date().toLocaleString(),
                updatedAt: new Date().toLocaleString()
            };
            db.orders.push(order);
            addNotification(db, "order", "New order received", summarizeOrder(order), { orderId: order.id });
            await writeDb(db);
            return sendJson(res, 201, { order });
        }

        const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
        if (orderMatch && req.method === "PATCH") {
            if (!requireAdmin(req, res, db)) return;
            const id = orderMatch[1];
            const body = await parseBody(req);
            const order = db.orders.find(item => item.id === id);
            if (!order) return sendJson(res, 404, { error: "Order not found" });
            const previousStatus = normalizeOrderStatus(order.status);
            const nextStatus = normalizeOrderStatus(body.status || previousStatus);
            const now = new Date().toLocaleString();

            order.status = nextStatus;
            order.updatedAt = now;

            if (previousStatus !== nextStatus) {
                const field = orderStatusTimeField(nextStatus);
                order[field] = order[field] || now;
                addNotification(
                    db,
                    "order",
                    `Order ${nextStatus}`,
                    `${order.id} moved from ${previousStatus} to ${nextStatus}`,
                    { orderId: order.id, status: nextStatus }
                );
            }

            if (nextStatus === "Making") order.confirmedAt = order.confirmedAt || order.makingAt || now;

            await writeDb(db);
            return sendJson(res, 200, { order });
        }

        if (orderMatch && req.method === "DELETE") {
            const session = requireUser(req, res, db);
            if (!session) return;
            const id = orderMatch[1];
            const order = db.orders.find(item => item.id === id);
            if (!order) return sendJson(res, 404, { error: "Order not found" });
            if (session.user.role !== "admin" && order.userId !== session.user.id) {
                return sendJson(res, 403, { error: "Not allowed" });
            }
            db.orders = db.orders.filter(item => item.id !== id);
            await writeDb(db);
            return sendJson(res, 200, { ok: true });
        }

        if (req.method === "GET" && url.pathname === "/api/notifications") {
            if (!requireAdmin(req, res, db)) return;
            return sendJson(res, 200, { notifications: db.notifications });
        }

        const notificationMatch = url.pathname.match(/^\/api\/notifications\/([^/]+)$/);
        if (notificationMatch && req.method === "PATCH") {
            if (!requireAdmin(req, res, db)) return;
            const id = notificationMatch[1];
            const notification = db.notifications.find(item => item.id === id);

            if (!notification) return sendJson(res, 404, { error: "Notification not found" });

            const body = await parseBody(req);
            notification.read = body.read !== false;
            notification.updatedAt = new Date().toISOString();
            await writeDb(db);
            return sendJson(res, 200, { notification });
        }

        return sendJson(res, 404, { error: "API route not found" });
    } catch (error) {
        return sendJson(res, 500, { error: error.message });
    }
}

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/api/")) {
        if (isRateLimited(req)) {
            sendJson(res, 429, { error: "Too many requests. Please try again shortly." });
            return;
        }
        handleApi(req, res).catch(error => {
            sendJson(res, 500, { error: error.message });
        });
    } else {
        serveStatic(req, res);
    }
});

ensureDb()
    .then(() => {
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`SmartOrnaments server running at http://localhost:${PORT}`);
            console.log(`MySQL database: ${MYSQL_DATABASE} on ${MYSQL_HOST}:${MYSQL_PORT}`);
            console.log(`Admin username: ${ADMIN_USERNAME}`);
            console.log(`Admin fallback username: ${LEGACY_ADMIN_USERNAME}`);
            console.log(process.env.ADMIN_PASSWORD
                ? "Admin password loaded from ADMIN_PASSWORD"
                : "Default admin password: admin123");
        });
    })
    .catch(error => {
        console.error("MySQL startup failed:", error.message);
        process.exit(1);
    });
