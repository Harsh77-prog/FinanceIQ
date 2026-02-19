const { Pool } = require("pg");

// Support both connection string (Neon/cloud) and local PostgreSQL
let poolConfig;

if (process.env.DATABASE_URL) {
  // ✅ Neon / Cloud PostgreSQL configuration
  poolConfig = {
    connectionString: process.env.DATABASE_URL,

    // Neon requires SSL
    ssl: {
      rejectUnauthorized: false,
    },

    // Pool settings (optimized for serverless DB)
    max: 10,                   // smaller pool works better with Neon
    idleTimeoutMillis: 30000,  // close idle clients after 30s
    connectionTimeoutMillis: 10000, // allow Neon cold start (10s)
    keepAlive: true,           // prevents random disconnects
  };
} else {
  // ✅ Local PostgreSQL configuration
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "finance_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

// Create pool
const pool = new Pool(poolConfig);

// Optional: Test DB connection once at startup
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
