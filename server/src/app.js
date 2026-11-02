const fs = require("node:fs/promises");
const path = require("node:path");
const bcrypt = require("bcrypt");
const connectPgSimple = require("connect-pg-simple");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PgSession = connectPgSimple(session);
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters");
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(
  session({
    name: "cait.sid",
    store: new PgSession({
      pool,
      tableName: "user_sessions",
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.get("/", (_req, res) => {
  res.json({ message: "Cait Res API is running!" });
});

app.get("/api/menu", async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        categories.id AS category_id,
        categories.name AS category_name,
        items.id AS item_id,
        items.name AS item_name,
        items.description,
        items.price
      FROM menu_categories AS categories
      LEFT JOIN menu_items AS items ON items.category_id = categories.id
      ORDER BY categories.position, items.position
    `);

    const categories = [];
    const categoriesById = new Map();
    for (const row of result.rows) {
      let category = categoriesById.get(row.category_id);
      if (!category) {
        category = {
          id: row.category_id,
          name: row.category_name,
          items: [],
        };
        categoriesById.set(row.category_id, category);
        categories.push(category);
      }

      if (row.item_id) {
        category.items.push({
          id: row.item_id,
          name: row.item_name,
          description: row.description,
          price: Number(row.price),
        });
      }
    }

    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/session", (req, res) => {
  if (!req.session.user) {
    res.json({ user: null });
    return;
  }

  res.json({ user: req.session.user });
});

app.post("/api/auth/signup", async (req, res, next) => {
  const email =
    typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    res.status(400).json({
      error: "Enter a valid email address and a password of at least 8 characters.",
    });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash],
    );
    const user = result.rows[0];

    req.session.regenerate((error) => {
      if (error) {
        next(error);
        return;
      }

      req.session.user = user;
      req.session.save((saveError) => {
        if (saveError) {
          next(saveError);
          return;
        }

        res.status(201).json({ user });
      });
    });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "An account with that email already exists." });
      return;
    }

    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  const email =
    typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email],
    );
    const userRecord = result.rows[0];
    if (!userRecord || !(await bcrypt.compare(password, userRecord.password_hash))) {
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }

    const user = { id: userRecord.id, email: userRecord.email };
    req.session.regenerate((error) => {
      if (error) {
        next(error);
        return;
      }

      req.session.user = user;
      req.session.save((saveError) => {
        if (saveError) {
          next(saveError);
          return;
        }

        res.json({ user });
      });
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("cait.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({ user: null });
  });
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

async function start() {
  const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Cait Res API running on port ${port}`);
  });
}

start().catch(async (error) => {
  console.error("Could not start the API:", error);
  await pool.end();
  process.exitCode = 1;
});
