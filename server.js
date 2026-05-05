const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(ROOT, "data");
const DB_FILE = process.env.DB_FILE
    ? path.resolve(process.env.DB_FILE)
    : path.join(DATA_DIR, "db.json");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const defaultProducts = [
    {
        id: "rose-keychain",
        name: "Rose Keychain",
        price: 99,
        image: "images/Keychain.jpeg",
        type: "love",
        description: "A personalized keychain for simple, sweet gifting.",
        featured: true
    },
    {
        id: "bracelet-gift",
        name: "Bracelet Gift",
        price: 199,
        image: "images/Braclet.jpeg",
        type: "birthday",
        description: "A neat bracelet gift for birthdays and special days.",
        featured: true
    },
    {
        id: "name-keychain",
        name: "Name Keychain",
        price: 149,
        image: "images/Keychain.jpeg",
        type: "friend",
        description: "A custom name keychain for friends and keepsakes.",
        featured: false
    }
];

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    const [salt] = stored.split(":");
    return hashPassword(password, salt) === stored;
}

function ensureDb() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
        writeDb({
            users: [
                {
                    id: "admin",
                    username: ADMIN_USERNAME,
                    passwordHash: hashPassword(ADMIN_PASSWORD),
                    role: "admin"
                }
            ],
            sessions: [],
            products: defaultProducts,
            orders: [],
            lastOrderNumber: 1000
        });
    }
}

function readDb() {
    ensureDb();
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function isPathInside(parent, target) {
    const relative = path.relative(parent, target);
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function sendJson(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
            if (body.length > 1_000_000) req.destroy();
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

function nextOrderId(db) {
    db.lastOrderNumber = Number(db.lastOrderNumber || 1000) + 1;
    return "SO-" + db.lastOrderNumber;
}

function serveStatic(req, res) {
    const requestPath = decodeURIComponent(req.url.split("?")[0]);
    const safePath = requestPath === "/" ? "/index.html" : requestPath;
    const segments = safePath.split("/").filter(Boolean);
    const filePath = path.normalize(path.join(ROOT, safePath));

    const blockedTopLevel = new Set(["data", "node_modules"]);
    const blockedPath = segments.some(segment => segment.startsWith("."))
        || blockedTopLevel.has(segments[0])
        || isPathInside(DATA_DIR, filePath);

    if (!isPathInside(ROOT, filePath) || blockedPath) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const types = {
            ".html": "text/html",
            ".css": "text/css",
            ".js": "application/javascript",
            ".json": "application/json",
            ".jpeg": "image/jpeg",
            ".jpg": "image/jpeg",
            ".png": "image/png"
        };

        res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
        res.end(content);
    });
}

async function handleApi(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const db = readDb();

    try {
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
            writeDb(db);
            return sendJson(res, 201, { user: publicUser(user) });
        }

        if (req.method === "POST" && url.pathname === "/api/login") {
            const body = await parseBody(req);
            const username = String(body.username || "").trim();
            const password = String(body.password || "");
            const user = db.users.find(item => item.username.toLowerCase() === username.toLowerCase());

            if (!user || !verifyPassword(password, user.passwordHash)) {
                return sendJson(res, 401, { error: "Invalid login" });
            }

            const token = crypto.randomBytes(32).toString("hex");
            db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
            writeDb(db);
            return sendJson(res, 200, { token, user: publicUser(user) });
        }

        if (req.method === "POST" && url.pathname === "/api/logout") {
            const session = getSession(req, db);
            if (session) {
                db.sessions = db.sessions.filter(item => item.token !== session.token);
                writeDb(db);
            }
            return sendJson(res, 200, { ok: true });
        }

        if (req.method === "GET" && url.pathname === "/api/products") {
            return sendJson(res, 200, { products: db.products });
        }

        if (req.method === "POST" && url.pathname === "/api/products") {
            if (!requireAdmin(req, res, db)) return;
            const product = await parseBody(req);
            product.id = product.id || crypto.randomUUID();
            db.products.push(product);
            writeDb(db);
            return sendJson(res, 201, { product });
        }

        const productMatch = url.pathname.match(/^\/api\/products\/([^/]+)$/);
        if (productMatch && req.method === "PUT") {
            if (!requireAdmin(req, res, db)) return;
            const id = productMatch[1];
            const product = await parseBody(req);
            const index = db.products.findIndex(item => item.id === id);
            if (index < 0) return sendJson(res, 404, { error: "Product not found" });
            db.products[index] = { ...product, id };
            writeDb(db);
            return sendJson(res, 200, { product: db.products[index] });
        }

        if (productMatch && req.method === "DELETE") {
            if (!requireAdmin(req, res, db)) return;
            const id = productMatch[1];
            db.products = db.products.filter(item => item.id !== id);
            writeDb(db);
            return sendJson(res, 200, { ok: true });
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
            const order = {
                ...body,
                id: nextOrderId(db),
                userId: session.user.id,
                date: new Date().toLocaleString(),
                status: "Pending"
            };
            db.orders.push(order);
            writeDb(db);
            return sendJson(res, 201, { order });
        }

        const orderMatch = url.pathname.match(/^\/api\/orders\/([^/]+)$/);
        if (orderMatch && req.method === "PATCH") {
            if (!requireAdmin(req, res, db)) return;
            const id = orderMatch[1];
            const body = await parseBody(req);
            const order = db.orders.find(item => item.id === id);
            if (!order) return sendJson(res, 404, { error: "Order not found" });
            order.status = body.status || order.status;
            writeDb(db);
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
            writeDb(db);
            return sendJson(res, 200, { ok: true });
        }

        return sendJson(res, 404, { error: "API route not found" });
    } catch (error) {
        return sendJson(res, 500, { error: error.message });
    }
}

const server = http.createServer((req, res) => {
    if (req.url.startsWith("/api/")) {
        handleApi(req, res);
    } else {
        serveStatic(req, res);
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartOrnaments server running at http://localhost:${PORT}`);
    console.log(`Admin username: ${ADMIN_USERNAME}`);
    console.log(process.env.ADMIN_PASSWORD
        ? "Admin password loaded from ADMIN_PASSWORD"
        : "Default admin password: admin123");
});
