function money(price) {
    return "Rs. " + price;
}

function orderMoney(price) {
    return "₹" + price;
}

function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
}

function titleFromValue(value) {
    const labels = {
        friend: "Friend",
        family: "Family",
        partner: "Partner",
        sibling: "Sibling"
    };

    return labels[value] || value || "Not provided";
}

function occasionTitle(value) {
    const labels = {
        birthday: "Birthday",
        love: "Love",
        friend: "Friendship"
    };

    return labels[value] || value || "Not provided";
}

function defaultRelationship(occasion) {
    if (occasion === "love") return "Partner";
    if (occasion === "family") return "Family";
    return occasion ? "Friend" : "";
}

function buildDirectOrderMessage(product, price, details = {}) {
    const occasion = details.occasion || "";
    const relationship = details.relationship || defaultRelationship(occasion);

    return [
        "Hi, I want to order:",
        "",
        `Product: ${product || "Custom Keychain"}`,
        `Name: ${details.name || "Not provided"}`,
        `Occasion: ${occasionTitle(occasion)}`,
        `Relationship: ${titleFromValue(relationship)}`,
        `Price: ${orderMoney(price || 0)}`,
        "",
        "Please confirm my order 🙂"
    ].join("\n");
}

function getDirectOrderDetails() {
    const isGiftFinder = Boolean(document.getElementById("budget"));

    return {
        name: getFieldValue("name") || (isGiftFinder ? localStorage.getItem("giftName") || "" : ""),
        occasion: getFieldValue("occasion") || (isGiftFinder ? localStorage.getItem("giftOccasion") || "" : ""),
        relationship: getFieldValue("relationship") || (isGiftFinder ? localStorage.getItem("giftRelationship") || "" : "")
    };
}

const useBackend = location.protocol === "http:" || location.protocol === "https:";

async function apiRequest(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = localStorage.getItem("authToken");

    if (token) headers.Authorization = "Bearer " + token;

    const response = await fetch(path, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}

function isApiUnavailableError(error) {
    return error instanceof TypeError
        || ["API route not found", "Request failed", "Failed to fetch"].includes(error.message);
}

function getCustomerKey() {
    const user = localStorage.getItem("loggedInUser");
    return user ? user.toLowerCase() : "guest";
}

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

function getProducts() {
    const savedProducts = localStorage.getItem("products");
    if (!savedProducts) return defaultProducts;

    const products = JSON.parse(savedProducts);
    return Array.isArray(products) ? products : defaultProducts;
}

async function getProductsData() {
    if (useBackend) {
        try {
            const data = await apiRequest("/api/products");
            saveProducts(data.products);
            return data.products;
        } catch (error) {
            console.warn(error.message);
        }
    }

    return getProducts();
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function makeProductId(name) {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

function findProduct(id) {
    return getProducts().find(product => product.id === id);
}

async function findProductData(id) {
    const products = await getProductsData();
    return products.find(product => product.id === id);
}

function quote(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function productCard(product, options = {}) {
    const addCartButton = options.hideCart
        ? ""
        : `<button onclick="addToCart('${quote(product.name)}', ${product.price})">Add to Cart</button>`;
    const adminButtons = options.admin
        ? `
            <button onclick="editAdminProduct('${quote(product.id)}')">Edit</button>
            <button onclick="deleteAdminProduct('${quote(product.id)}')">Delete</button>
        `
        : "";

    return `
        <div class="card" data-type="${product.type}">
            <img src="${product.image}" alt="${product.name}">
            <h3 onclick="openProduct('${quote(product.id)}')">${product.name}</h3>
            <p>${money(product.price)}</p>
            <small>${product.description || ""}</small>
            <button onclick="orderNow('${quote(product.name)}', ${product.price})">Order</button>
            ${addCartButton}
            ${adminButtons}
        </div>
    `;
}

async function renderFeaturedProducts() {
    const container = document.getElementById("featuredProducts");
    if (!container) return;

    const products = (await getProductsData()).filter(product => product.featured).slice(0, 3);
    container.innerHTML = products.map(product => productCard(product, { hideCart: true })).join("");
}

async function renderProducts() {
    const container = document.getElementById("productList");
    if (!container) return;

    container.innerHTML = (await getProductsData()).map(product => productCard(product)).join("");
    applyEmotionFilter();
}

async function loadAdminProducts() {
    const container = document.getElementById("adminProducts");
    if (!container) return;

    container.innerHTML = (await getProductsData())
        .map(product => productCard(product, { admin: true, hideCart: true }))
        .join("");
}

function getProductFormData() {
    const id = document.getElementById("productId").value;
    const name = document.getElementById("adminProductName").value.trim();
    const price = Number(document.getElementById("adminProductPrice").value);
    const image = document.getElementById("adminProductImage").value.trim();
    const type = document.getElementById("adminProductType").value;
    const description = document.getElementById("adminProductDescription").value.trim();
    const featured = document.getElementById("adminProductFeatured").checked;

    if (!name || !price || !image) {
        return null;
    }

    return {
        id: id || "",
        name,
        price,
        image,
        type,
        description,
        featured
    };
}

async function saveAdminProduct() {
    const product = getProductFormData();
    const msg = document.getElementById("productAdminMsg");
    const isEditing = Boolean(product?.id);

    if (!product) {
        msg.innerText = "Enter product name, price, and image path.";
        return;
    }

    if (useBackend) {
        try {
            const method = isEditing ? "PUT" : "POST";
            const path = isEditing ? "/api/products/" + encodeURIComponent(product.id) : "/api/products";
            await apiRequest(path, {
                method,
                body: JSON.stringify(product)
            });
            resetProductForm();
            await loadAdminProducts();
            msg.innerText = "Product saved.";
            return;
        } catch (error) {
            msg.innerText = error.message;
            return;
        }
    }

    const products = getProducts();
    const existingIndex = products.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) products[existingIndex] = product;
    else products.push({ ...product, id: makeProductId(product.name) });
    resetProductForm();
    loadAdminProducts();
    saveProducts(products);
    msg.innerText = "Product saved.";
}

async function editAdminProduct(id) {
    const product = await findProductData(id);
    if (!product) return;

    document.getElementById("productId").value = product.id;
    document.getElementById("adminProductName").value = product.name;
    document.getElementById("adminProductPrice").value = product.price;
    document.getElementById("adminProductImage").value = product.image;
    document.getElementById("adminProductType").value = product.type;
    document.getElementById("adminProductDescription").value = product.description || "";
    document.getElementById("adminProductFeatured").checked = Boolean(product.featured);
    document.getElementById("productAdminMsg").innerText = "Editing " + product.name;
}

async function deleteAdminProduct(id) {
    if (useBackend) {
        try {
            await apiRequest("/api/products/" + encodeURIComponent(id), { method: "DELETE" });
            await loadAdminProducts();
            resetProductForm();
            return;
        } catch (error) {
            document.getElementById("productAdminMsg").innerText = error.message;
            return;
        }
    }

    const products = getProducts().filter(product => product.id !== id);
    saveProducts(products);
    loadAdminProducts();
    resetProductForm();
}

function resetProductForm() {
    const formIds = [
        "productId",
        "adminProductName",
        "adminProductPrice",
        "adminProductImage",
        "adminProductDescription"
    ];

    formIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = "";
    });

    const type = document.getElementById("adminProductType");
    const featured = document.getElementById("adminProductFeatured");
    const msg = document.getElementById("productAdminMsg");

    if (type) type.value = "love";
    if (featured) featured.checked = false;
    if (msg) msg.innerText = "";
}

function orderNow(product, price) {
    const message = buildDirectOrderMessage(product, price);
    const url = `https://wa.me/916374118664?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

function searchProduct() {
    const input = document.getElementById("search").value.toLowerCase();
    const cards = document.getElementsByClassName("card");
    const type = localStorage.getItem("emotionFilter");
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const title = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        const itemType = cards[i].getAttribute("data-type");
        const matchSearch = title.includes(input);
        const matchFilter = !type || itemType === type;
        const isVisible = matchSearch && matchFilter;

        cards[i].style.display = isVisible ? "block" : "none";
        if (isVisible) visibleCount++;
    }

    updateNoProductsMessage(visibleCount);
}

async function openProduct(id) {
    const product = await findProductData(id);
    if (!product) return;

    localStorage.setItem("productId", product.id);
    localStorage.setItem("productName", product.name);
    localStorage.setItem("productPrice", product.price);
    localStorage.setItem("productImage", product.image);
    localStorage.setItem("productDescription", product.description || "");
    window.location.href = "product.html";
}

function loadProduct() {
    document.getElementById("productName").innerText = localStorage.getItem("productName") || "Product";
    document.getElementById("productPrice").innerText = money(localStorage.getItem("productPrice") || 0);
    document.getElementById("productImg").src = localStorage.getItem("productImage") || "images/Keychain.jpeg";
    const description = document.getElementById("productDescription");
    if (description) description.innerText = localStorage.getItem("productDescription") || "";
}

function orderProduct() {
    const name = localStorage.getItem("productName");
    const price = localStorage.getItem("productPrice");
    const message = buildDirectOrderMessage(name, price, getDirectOrderDetails());
    const url = `https://wa.me/916374118664?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

function getPurchasedItems() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return orders.flatMap(order => order.items || []);
}

function addCurrentProductToCart() {
    const name = localStorage.getItem("productName") || "Product";
    const price = Number(localStorage.getItem("productPrice") || 0);
    addToCart(name, price);
}

function generateGift() {
    const recipientName = getFieldValue("name");
    const budget = Number(document.getElementById("budget").value);
    const type = document.getElementById("occasion").value;
    const relationship = getFieldValue("relationship") || defaultRelationship(type);
    let product = "";
    let price = 0;

    if (type === "love") {
        product = budget <= 100 ? "Mini Love Keychain" : "Romantic Ornament";
        price = budget <= 100 ? 99 : 199;
    } else if (type === "birthday") {
        product = budget <= 150 ? "Birthday Keychain" : "Custom Keychain";
        price = budget <= 150 ? 120 : 199;
    } else {
        product = budget <= 100 ? "Friendship Band" : "Best Friend Keychain";
        price = budget <= 100 ? 99 : 149;
    }

    document.getElementById("result").innerText = `Suggested Gift: ${product} (${money(price)})`;
    localStorage.setItem("productName", product);
    localStorage.setItem("productPrice", price);
    localStorage.setItem("giftName", recipientName);
    localStorage.setItem("giftOccasion", type);
    localStorage.setItem("giftRelationship", relationship);
    document.getElementById("orderBtn").style.display = "block";
}

function filterEmotion(type) {
    localStorage.setItem("emotionFilter", type);
    window.location.href = "products.html?emotion=" + encodeURIComponent(type);
}

function applyEmotionFilter() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("emotion");
    const cards = document.getElementsByClassName("card");
    let visibleCount = 0;

    if (type) {
        localStorage.setItem("emotionFilter", type);
    } else {
        localStorage.removeItem("emotionFilter");
    }

    for (let i = 0; i < cards.length; i++) {
        const itemType = cards[i].getAttribute("data-type");
        const isVisible = !type || itemType === type;
        cards[i].style.display = isVisible ? "block" : "none";
        if (isVisible) visibleCount++;
    }

    updateNoProductsMessage(visibleCount);
}

function clearEmotionFilter() {
    localStorage.removeItem("emotionFilter");
    window.location.href = "products.html";
}

function updateNoProductsMessage(visibleCount) {
    const emptyEl = document.getElementById("noProducts");
    if (emptyEl) {
        emptyEl.style.display = visibleCount === 0 ? "block" : "none";
    }
}

function generateMessage() {
    const type = document.getElementById("occasion").value;
    const message = type === "birthday"
        ? "Happy Birthday! This gift is specially for you."
        : type === "love"
        ? "This gift carries all my love for you."
        : "You are an amazing friend. Enjoy this gift.";

    document.getElementById("msg").innerText = message;
    localStorage.setItem("customMessage", message);
}

function getPurchaseBasedOffer(items) {
    const names = items.map(item => item.name.toLowerCase()).join(" ");
    const totalSpent = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    if (totalSpent >= 300) {
        return "20% OFF on your next custom order";
    }

    if (names.includes("bracelet")) {
        return "15% OFF on your next keychain";
    }

    if (names.includes("keychain")) {
        return "Free name customization on your next order";
    }

    return "10% OFF on your next order";
}

function spinWheel() {
    const customerKey = getCustomerKey();
    const spinKey = "spinUsed:" + customerKey;
    const offerEl = document.getElementById("offer");

    if (localStorage.getItem(spinKey)) {
        const savedOffer = localStorage.getItem("offer") || "Already used";
        offerEl.innerText = "Spin already used. Your offer: " + savedOffer;
        return;
    }

    const purchasedItems = getPurchasedItems();
    const result = purchasedItems.length > 0
        ? getPurchaseBasedOffer(purchasedItems)
        : "Better luck next time";

    offerEl.innerText = "You got: " + result;
    localStorage.setItem("offer", result);
    localStorage.setItem(spinKey, "true");
}

let authMode = "login";

function authElements() {
    return {
        username: document.getElementById("username"),
        password: document.getElementById("password"),
        remember: document.getElementById("rememberUser"),
        title: document.getElementById("authTitle"),
        subtitle: document.getElementById("authSubtitle"),
        submit: document.getElementById("authSubmit"),
        switchButton: document.getElementById("authSwitch"),
        loginTab: document.getElementById("loginTab"),
        signupTab: document.getElementById("signupTab"),
        sessionMsg: document.getElementById("sessionMsg"),
        msg: document.getElementById("msg")
    };
}

function setAuthMessage(text, type = "") {
    const { msg } = authElements();
    if (!msg) return;

    msg.innerText = text;
    msg.className = "auth-message" + (type ? " " + type : "");
}

function setAuthMode(mode) {
    authMode = mode === "signup" ? "signup" : "login";
    const els = authElements();
    if (!els.title) return;

    const isSignup = authMode === "signup";
    els.title.innerText = isSignup ? "Create Account" : "Login";
    els.subtitle.innerText = isSignup
        ? "Create your account and start shopping."
        : "Enter your account details to continue.";
    els.submit.innerText = isSignup ? "Signup" : "Login";
    els.switchButton.innerText = isSignup ? "Already have an account?" : "Create account";
    els.password.autocomplete = isSignup ? "new-password" : "current-password";
    els.loginTab.classList.toggle("active", !isSignup);
    els.signupTab.classList.toggle("active", isSignup);
    setAuthMessage("");
}

function toggleAuthMode() {
    setAuthMode(authMode === "login" ? "signup" : "login");
}

function initAuthPage() {
    showUser();

    const params = new URLSearchParams(window.location.search);
    setAuthMode(params.get("mode") === "signup" ? "signup" : "login");

    const els = authElements();
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const loggedInUser = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");

    if (rememberedUsername && els.username) {
        els.username.value = rememberedUsername;
        if (els.remember) els.remember.checked = true;
    }

    if (loggedInUser && els.sessionMsg) {
        const target = role === "admin" ? "admin.html" : "index.html";
        els.sessionMsg.innerHTML = `Signed in as <b>${escapeHtml(loggedInUser)}</b>. <a href="${target}">Continue</a>`;
    }
}

function submitAuth(event) {
    event.preventDefault();
    return authMode === "signup" ? signup() : login();
}

function getAuthCredentials() {
    const { username, password } = authElements();
    const enteredUsername = username?.value.trim() || "";
    const enteredPassword = password?.value || "";

    if (!enteredUsername || !enteredPassword) {
        setAuthMessage("Enter username and password", "error");
        return null;
    }

    return {
        username: enteredUsername,
        password: enteredPassword
    };
}

function rememberUsername(username) {
    const { remember } = authElements();
    if (remember?.checked) {
        localStorage.setItem("rememberedUsername", username);
    } else {
        localStorage.removeItem("rememberedUsername");
    }
}

function loginDestination(role) {
    return role === "admin" ? "admin.html" : "index.html";
}

function completeLogin(user, token = "") {
    localStorage.setItem("loggedInUser", user.username);
    localStorage.setItem("userRole", user.role || "customer");

    if (token) {
        localStorage.setItem("authToken", token);
    } else {
        localStorage.removeItem("authToken");
    }

    rememberUsername(user.username);
    setAuthMessage("Login successful", "success");
    setTimeout(() => window.location.href = loginDestination(user.role), 700);
}

function getLocalUsers() {
    let users = [];

    try {
        const savedUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        users = Array.isArray(savedUsers) ? savedUsers : [];
    } catch (error) {
        users = [];
    }

    if (!users.some(user => user.username.toLowerCase() === "admin")) {
        users.push({ username: "admin", password: "admin123", role: "admin" });
    }

    const legacyUsername = localStorage.getItem("user");
    const legacyPassword = localStorage.getItem("pass");
    const hasLegacyUser = legacyUsername && legacyPassword
        && !users.some(user => user.username.toLowerCase() === legacyUsername.toLowerCase());

    if (hasLegacyUser) {
        users.push({
            username: legacyUsername,
            password: legacyPassword,
            role: legacyUsername.toLowerCase() === "admin" ? "admin" : "customer"
        });
    }

    return users;
}

function saveLocalUsers(users) {
    localStorage.setItem("localUsers", JSON.stringify(users));
}

async function signup() {
    const credentials = getAuthCredentials();
    if (!credentials) return false;

    if (credentials.password.length < 4) {
        setAuthMessage("Password must be at least 4 characters", "error");
        return false;
    }

    if (useBackend) {
        try {
            await apiRequest("/api/signup", {
                method: "POST",
                body: JSON.stringify(credentials)
            });
            setAuthMessage("Account created. Logging in...", "success");
            await login();
            return true;
        } catch (error) {
            if (isApiUnavailableError(error)) {
                console.warn(error.message);
            } else {
                setAuthMessage(error.message, "error");
                return false;
            }
        }
    }

    const users = getLocalUsers();
    const exists = users.some(user => user.username.toLowerCase() === credentials.username.toLowerCase());

    if (exists) {
        setAuthMessage("Username already exists", "error");
        return false;
    }

    const user = {
        username: credentials.username,
        password: credentials.password,
        role: "customer"
    };

    users.push(user);
    saveLocalUsers(users);
    localStorage.setItem("user", credentials.username);
    localStorage.setItem("pass", credentials.password);
    completeLogin(user);
    return true;
}

async function login() {
    const credentials = getAuthCredentials();
    if (!credentials) return false;

    if (useBackend) {
        try {
            const data = await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify(credentials)
            });
            completeLogin(data.user, data.token);
            return true;
        } catch (error) {
            if (isApiUnavailableError(error)) {
                console.warn(error.message);
            } else {
                setAuthMessage(error.message, "error");
                return false;
            }
        }
    }

    const user = getLocalUsers().find(item =>
        item.username.toLowerCase() === credentials.username.toLowerCase()
        && item.password === credentials.password
    );

    if (!user) {
        setAuthMessage("Invalid login. Signup first or use admin / admin123.", "error");
        return false;
    }

    completeLogin(user);
    return true;
}

function togglePassword(button) {
    const passwordInput = document.getElementById("password");
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    button.innerText = isHidden ? "Hide" : "Show";
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function showUser() {
    const user = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    const displays = document.querySelectorAll("#userDisplay");

    displays.forEach(display => {
        display.classList.add("user-menu");

        if (!user) {
            display.innerHTML = "";
            return;
        }

        const nav = display.closest("nav");
        const hasLoginButton = nav?.querySelector(".login-btn");
        const adminLink = role === "admin" ? `<a href="admin.html">Admin</a>` : "";
        const logoutButton = hasLoginButton ? "" : `<button type="button" onclick="logout(event)">Logout</button>`;

        display.innerHTML = `
            <span class="user-chip">Hi, ${escapeHtml(user)}</span>
            ${adminLink}
            ${logoutButton}
        `;
    });

    document.querySelectorAll(".login-btn").forEach(link => {
        if (!user) {
            link.href = "login.html";
            link.innerText = "Login";
            link.onclick = null;
            link.classList.remove("is-logout");
            return;
        }

        link.href = "#";
        link.innerText = "Logout";
        link.onclick = logout;
        link.classList.add("is-logout");
    });
}

function requireLogin() {
    if (localStorage.getItem("loggedInUser")) {
        return true;
    }

    window.location.href = "login.html";
    return false;
}

function addToCart(name, price) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.name === name && Number(item.price) === Number(price));

    if (existingItem) {
        existingItem.qty = Number(existingItem.qty || 1) + 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart");
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cartItems");
    let total = 0;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-state show-empty">Your cart is empty.</p>`;
        document.getElementById("total").innerText = "";
        updateOrderSummary();
        return;
    }

    cart.forEach((item, i) => {
        const qty = Number(item.qty || 1);
        total += item.price * qty;
        container.innerHTML += `
            <div class="cart-card">
                <div>
                    <h3>${item.name}</h3>
                    <p>${money(item.price)} each</p>
                    <p><b>Subtotal:</b> ${money(item.price * qty)}</p>
                </div>
                <div class="qty-controls">
                    <button onclick="changeCartQty(${i}, -1)">-</button>
                    <span>${qty}</span>
                    <button onclick="changeCartQty(${i}, 1)">+</button>
                </div>
                <button onclick="removeItem(${i})">Remove</button>
            </div>
        `;
    });

    document.getElementById("total").innerText = "Total: " + money(total);
    updateOrderSummary();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function changeCartQty(index, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart[index];
    if (!item) return;

    item.qty = Number(item.qty || 1) + change;

    if (item.qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function nextOrderId() {
    const current = Number(localStorage.getItem("lastOrderNumber") || 1000) + 1;
    localStorage.setItem("lastOrderNumber", current);
    return "SO-" + current;
}

function toggleNav(button) {
    const nav = button.closest("nav");
    nav.classList.toggle("open");
    button.innerText = nav.classList.contains("open") ? "Close" : "Menu";
}

function getCartTotal(cart) {
    return cart.reduce((sum, item) => {
        const qty = Number(item.qty || 1);
        return sum + Number(item.price || 0) * qty;
    }, 0);
}

function updateOrderSummary() {
    const summary = document.getElementById("orderSummary");
    if (!summary) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const offer = localStorage.getItem("offer") || "No offer";

    if (cart.length === 0) {
        summary.innerHTML = "<p>Add products to see your checkout summary.</p>";
        return;
    }

    const items = cart.map(item => {
        const qty = Number(item.qty || 1);
        return `<p>${item.name} x ${qty} - ${money(item.price * qty)}</p>`;
    }).join("");

    summary.innerHTML = `
        ${items}
        <hr>
        <p><b>Total:</b> ${money(getCartTotal(cart))}</p>
        <p><b>Offer:</b> ${offer}</p>
    `;
}

function getCheckoutDetails() {
    const savedUser = localStorage.getItem("loggedInUser");
    return {
        name: document.getElementById("userName").value.trim() || savedUser || "",
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        customization: document.getElementById("customization").value.trim() || "None",
        deliveryNote: document.getElementById("deliveryNote").value.trim() || "None"
    };
}

function validateCheckout(details) {
    if (!details.name || !details.phone || !details.address) {
        return "Name, phone number, and address are required.";
    }

    if (details.phone.replace(/\D/g, "").length < 10) {
        return "Enter a valid phone number.";
    }

    return "";
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const el = document.getElementById("cartCount");
    const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 1), 0);
    if (el) el.innerText = totalQty;
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const details = getCheckoutDetails();
    const checkoutMsg = document.getElementById("checkoutMsg");
    const validationError = validateCheckout(details);

    if (validationError) {
        checkoutMsg.innerText = validationError;
        return;
    }

    const offer = localStorage.getItem("offer") || "No offer";
    let message = "Hi, I want to order from SmartOrnaments.\n\n";
    message += `Customer Details\nName: ${details.name}\nPhone: ${details.phone}\nAddress: ${details.address}\n`;
    message += `Customization: ${details.customization}\nDelivery Note: ${details.deliveryNote}\n\nItems\n`;

    cart.forEach((item, i) => {
        const qty = Number(item.qty || 1);
        const subtotal = item.price * qty;
        message += `${i + 1}. ${item.name} x ${qty} - ${money(subtotal)}\n`;
    });

    const total = getCartTotal(cart);
    const orderData = {
        items: cart,
        total: total,
        customer: details,
        offer: offer,
        status: "Pending"
    };

    if (useBackend) {
        apiRequest("/api/orders", {
            method: "POST",
            body: JSON.stringify(orderData)
        }).then(data => {
            finishCheckout(data.order, message);
        }).catch(error => {
            checkoutMsg.innerText = error.message + ". Please login before checkout.";
        });
        return;
    }

    const orderId = nextOrderId();
    const order = {
        ...orderData,
        id: orderId,
        date: new Date().toLocaleString()
    };
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    finishCheckout(order, message);
}

function finishCheckout(order, baseMessage) {
    const message = `${baseMessage}\nOrder ID: ${order.id}\nTotal: ${money(order.total)}\nOffer: ${order.offer || "No offer"}`;
    localStorage.setItem("lastOrderId", order.id);
    window.open(`https://wa.me/919344586609?text=${encodeURIComponent(message)}`, "_blank");
    localStorage.removeItem("cart");
    updateCartCount();
    window.location.href = "success.html";
}

async function loadOrderSuccess() {
    const orderId = localStorage.getItem("lastOrderId");
    const orders = await getOrdersData();
    const order = orders.find(item => item.id === orderId) || orders[orders.length - 1];

    if (!order) {
        document.getElementById("successOrderId").innerText = "No recent order";
        document.getElementById("successTotal").innerText = "Place an order to see confirmation details.";
        return;
    }

    document.getElementById("successOrderId").innerText = order.id || "Order";
    document.getElementById("successTotal").innerText = "Total: " + money(order.total);
    document.getElementById("successOffer").innerText = "Offer: " + (order.offer || "No offer");
}

async function getOrdersData() {
    if (useBackend) {
        try {
            const data = await apiRequest("/api/orders");
            localStorage.setItem("orders", JSON.stringify(data.orders));
            return data.orders;
        } catch (error) {
            console.warn(error.message);
        }
    }

    return JSON.parse(localStorage.getItem("orders")) || [];
}

async function loadOrders() {
    const orders = await getOrdersData();
    const container = document.getElementById("orderList");

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    orders.forEach((order, index) => {
        let itemsHTML = "";

        order.items.forEach(item => {
            const qty = Number(item.qty || 1);
            itemsHTML += `<p>- ${item.name} x ${qty} - ${money(item.price * qty)}</p>`;
        });

        container.innerHTML += `
            <div class="card fade-in">
                <h3>${order.id || "Order #" + (index + 1)}</h3>
                ${itemsHTML}
                <hr>
                <p><b>Total:</b> ${money(order.total)}</p>
                <p><b>Offer:</b> ${order.offer || "No offer"}</p>
                <small>${order.date}</small>
                <p class="status" style="color:${
                    order.status === "Pending" ? "orange" :
                    order.status === "Confirmed" ? "blue" : "green"
                }">Status: ${order.status}</p>
                <button onclick="updateStatus(${index})">Update Status</button>
                <button onclick="reorder(${index})">Reorder</button>
                <button onclick="deleteOrder(${index})">Delete</button>
            </div>
       `;
    });
}

function reorder(index) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("cart", JSON.stringify(orders[index].items));
    alert("Items added to cart");
    window.location.href = "cart.html";
}

async function deleteOrder(index) {
    const orders = await getOrdersData();
    const order = orders[index];

    if (useBackend && order?.id) {
        try {
            await apiRequest("/api/orders/" + encodeURIComponent(order.id), { method: "DELETE" });
            if (document.getElementById("adminOrders")) await loadAdminOrders();
            else await loadOrders();
            return;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));

    if (document.getElementById("adminOrders")) {
        loadAdminOrders();
    } else {
        loadOrders();
    }
}

window.addEventListener("scroll", () => {
    document.querySelectorAll(".fade-in").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("show");
        }
    });
});

async function updateStatus(index) {
    const orders = await getOrdersData();
    const current = orders[index].status || "Pending";
    const next =
        current === "Pending" ? "Confirmed" :
        current === "Confirmed" ? "Delivered" :
        "Delivered";

    if (useBackend && orders[index]?.id) {
        try {
            await apiRequest("/api/orders/" + encodeURIComponent(orders[index].id), {
                method: "PATCH",
                body: JSON.stringify({ status: next })
            });
            if (document.getElementById("adminOrders")) await loadAdminOrders();
            else await loadOrders();
            return;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    orders[index].status = next;
    localStorage.setItem("orders", JSON.stringify(orders));

    if (document.getElementById("adminOrders")) {
        loadAdminOrders();
    } else {
        loadOrders();
    }
}

function checkAdmin() {
    const user = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");

    if (useBackend && role !== "admin") {
        alert("Access Denied");
        window.location.href = "login.html";
        return;
    }

    if (!useBackend && role !== "admin" && user !== "admin") {
        alert("Access Denied");
        window.location.href = "login.html";
    }
}

let currentOrderFilter = "all";

function setOrderFilter(status) {
    currentOrderFilter = status;

    document.querySelectorAll(".order-filters button").forEach(button => {
        button.classList.toggle("active", button.innerText === status || (status === "all" && button.innerText === "All"));
    });

    loadAdminOrders();
}

async function loadAdminOrders() {
    const orders = await getOrdersData();
    const container = document.getElementById("adminOrders");
    const allRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const visibleOrders = currentOrderFilter === "all"
        ? orders
        : orders.filter(order => (order.status || "Pending") === currentOrderFilter);

    container.innerHTML = "";
    document.getElementById("totalOrders").innerText = orders.length;
    document.getElementById("totalRevenue").innerText = money(allRevenue);

    if (orders.length === 0) {
        container.innerHTML = "<p>No orders yet</p>";
        return;
    }

    if (visibleOrders.length === 0) {
        container.innerHTML = "<p>No orders for this status.</p>";
    }

    visibleOrders.forEach((order) => {
        const index = orders.indexOf(order);
        let itemsHTML = "";

        order.items.forEach(item => {
            const qty = Number(item.qty || 1);
            itemsHTML += `<p>- ${item.name} x ${qty} - ${money(item.price * qty)}</p>`;
        });

        container.innerHTML += `
            <div class="card fade-in">
                <h3>${order.id || "Order #" + (index + 1)}</h3>
                <p><b>Customer:</b> ${order.customer?.name || "Customer"}</p>
                <p><b>Phone:</b> ${order.customer?.phone || "Not provided"}</p>
                <p><b>Address:</b> ${order.customer?.address || "Not provided"}</p>
                <p><b>Customization:</b> ${order.customer?.customization || "None"}</p>
                <p><b>Delivery Note:</b> ${order.customer?.deliveryNote || "None"}</p>
                ${itemsHTML}
                <hr>
                <p><b>Total:</b> ${money(order.total)}</p>
                <p><b>Offer:</b> ${order.offer || "No offer"}</p>
                <p><b>Status:</b> ${order.status || "Pending"}</p>
                <small>${order.date}</small>
                <br><br>
                <button onclick="updateStatus(${index})">Change Status</button>
                <button onclick="deleteOrder(${index})">Delete</button>
            </div>
        `;
    });

}

async function logout(event) {
    if (event) event.preventDefault();

    if (useBackend) {
        try {
            await apiRequest("/api/logout", { method: "POST" });
        } catch (error) {
            console.warn(error.message);
        }
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}
