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
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "smartornaments.shop@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const LEGACY_ADMIN_USERNAME = "admin";
const OWNER_EMAIL = process.env.OWNER_EMAIL || ADMIN_USERNAME;

function nameFromImagePath(image) {
    return String(image || "")
        .split("/")
        .pop()
        .replace(/\.[^.]+$/, "")
        .replace(/\s+/g, " ")
        .trim();
}

function slugFromText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

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
        description: `${group.description} Choose the ${name} design and personalize it your way.`,
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
            contacts: [],
            notifications: [],
            lastOrderNumber: 1000
        });
    }
}

function readDb() {
    ensureDb();
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    let changed = false;

    if (!Array.isArray(db.users)) {
        db.users = [];
        changed = true;
    }

    if (!Array.isArray(db.sessions)) {
        db.sessions = [];
        changed = true;
    }

    if (!Array.isArray(db.products)) {
        db.products = defaultProducts;
        changed = true;
    }

    if (!Array.isArray(db.orders)) {
        db.orders = [];
        changed = true;
    }

    if (!Array.isArray(db.contacts)) {
        db.contacts = [];
        changed = true;
    }

    if (!Array.isArray(db.notifications)) {
        db.notifications = [];
        changed = true;
    }

    if (!Number(db.lastOrderNumber)) {
        db.lastOrderNumber = 1000;
        changed = true;
    }

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

    if (changed) writeDb(db);

    return db;
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
            const username = String(body.username || body.email || "").trim();
            const password = String(body.password || "");
            const user = db.users.find(item => matchesLogin(item, username));

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
            writeDb(db);
            return sendJson(res, 201, { contact, notification, ownerEmail: OWNER_EMAIL });
        }

        if (req.method === "GET" && url.pathname === "/api/contacts") {
            if (!requireAdmin(req, res, db)) return;
            return sendJson(res, 200, { contacts: db.contacts });
        }

        if (req.method === "GET" && url.pathname === "/api/products") {
            return sendJson(res, 200, { products: db.products });
        }

        if (req.method === "GET" && url.pathname === "/api/stats") {
            const bestSeller = bestSellerFromOrders(db.orders, db.products);
            return sendJson(res, 200, {
                bestSeller,
                totalOrders: db.orders.length,
                revenue: db.orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
                productsCount: db.products.length,
                usersCount: db.users.length
            });
        }

        if (req.method === "POST" && url.pathname === "/api/products") {
            if (!requireAdmin(req, res, db)) return;
            const product = await parseBody(req);
            product.id = product.id || crypto.randomUUID();
            db.products.push(product);
            addNotification(
                db,
                "product",
                "Product added",
                `${product.name || "Product"} was added to the shop`,
                { productId: product.id }
            );
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
            addNotification(
                db,
                "product",
                "Product updated",
                `${db.products[index].name || "Product"} was updated`,
                { productId: id }
            );
            writeDb(db);
            return sendJson(res, 200, { product: db.products[index] });
        }

        if (productMatch && req.method === "DELETE") {
            if (!requireAdmin(req, res, db)) return;
            const id = productMatch[1];
            const product = db.products.find(item => item.id === id);
            db.products = db.products.filter(item => item.id !== id);
            addNotification(
                db,
                "product",
                "Product deleted",
                `${product?.name || "Product"} was removed from the shop`,
                { productId: id }
            );
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
                status: "Pending",
                placedAt: new Date().toLocaleString(),
                updatedAt: new Date().toLocaleString()
            };
            db.orders.push(order);
            addNotification(db, "order", "New order received", summarizeOrder(order), { orderId: order.id });
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
            const previousStatus = normalizeOrderStatus(order.status);
            const nextStatus = normalizeOrderStatus(body.status || previousStatus);
            const now = new Date().toLocaleString();

            order.status = nextStatus;
            order.updatedAt = now;

            if (previousStatus !== nextStatus) {
                const field = orderStatusTimeField(nextStatus);
                order[field] = order[field] || now;
            }

            if (nextStatus === "Making") order.confirmedAt = order.confirmedAt || order.makingAt || now;

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
            writeDb(db);
            return sendJson(res, 200, { notification });
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
    console.log(`Admin fallback username: ${LEGACY_ADMIN_USERNAME}`);
    console.log(process.env.ADMIN_PASSWORD
        ? "Admin password loaded from ADMIN_PASSWORD"
        : "Default admin password: admin123");
});
