const Product = require("../models/Product");
const seedProducts = require("../data/seedProducts");

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

function clampNumber(value, fallback = 0, min = 0, max = Number.POSITIVE_INFINITY) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(Math.max(number, min), max);
}

function normalizeProduct(body) {
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
  const image = body.image || images[0] || "";
  const type = body.type || body.categorySlug || "keychain";
  const category = String(body.category || categoryLabels[type] || type || "Product").trim();

  return {
    name: String(body.name || "").trim(),
    price: clampNumber(body.price, 0, 0),
    image,
    images: images.length ? images : image ? [image] : [],
    type,
    category,
    description: body.description || "",
    stock: Math.floor(clampNumber(body.stock, 0, 0)),
    rating: clampNumber(body.rating, 0, 0, 5),
    featured: Boolean(body.featured),
    occasions: Array.isArray(body.occasions) ? body.occasions : []
  };
}

function mapProduct(product) {
  return {
    id: product._id,
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    images: product.images,
    type: product.type,
    category: product.category || categoryLabels[product.type] || "Product",
    description: product.description,
    stock: Number(product.stock || 0),
    rating: Number(product.rating || 0),
    featured: product.featured,
    occasions: product.occasions,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(seedProducts);
  }

  await Product.updateMany(
    { stock: { $exists: false } },
    { $set: { stock: 20 } }
  );
}

async function getProducts(req, res) {
  await seedIfEmpty();
  const query = {};
  const search = String(req.query.search || "").trim();
  const category = String(req.query.category || "").trim();

  if (category) {
    query.$or = [
      { category: new RegExp(category, "i") },
      { type: new RegExp(category, "i") }
    ];
  }

  if (search) {
    const searchQuery = [
      { name: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { category: new RegExp(search, "i") },
      { type: new RegExp(search, "i") }
    ];

    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchQuery }];
      delete query.$or;
    } else {
      query.$or = searchQuery;
    }
  }

  const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });
  res.json({ products: products.map(mapProduct) });
}

async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product: mapProduct(product) });
}

async function createProduct(req, res) {
  const productData = normalizeProduct(req.body);

  if (!productData.name || !productData.price || !productData.image) {
    return res.status(400).json({ message: "Product name, price, and image are required" });
  }

  const product = await Product.create(productData);
  res.status(201).json({ product: mapProduct(product) });
}

async function uploadProductImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "Product image is required" });
  }

  const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME
    && process.env.CLOUDINARY_API_KEY
    && process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinaryConfig) {
    return res.status(500).json({ message: "Cloudinary environment variables are not configured" });
  }

  const cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: process.env.CLOUDINARY_FOLDER || "smartornaments/products",
    resource_type: "image"
  });

  res.status(201).json({
    image: result.secure_url,
    publicId: result.public_id
  });
}

async function updateProduct(req, res) {
  const productData = normalizeProduct(req.body);
  const product = await Product.findByIdAndUpdate(req.params.id, productData, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product: mapProduct(product) });
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ ok: true });
}

module.exports = { createProduct, deleteProduct, getProduct, getProducts, updateProduct, uploadProductImage };
