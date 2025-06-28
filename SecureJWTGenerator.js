// SecureJWTGenerator.js
require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// STEP 1: Generate a 512-bit (64 bytes) secret key
const secretKey = crypto.randomBytes(64).toString("hex");

// Optional: You can store this in a .env file or secret manager
console.log(`🔑 Generated 512-bit secret key:\n${secretKey}\n`);

// STEP 2: Sign a JWT using HS512
const payload = {
  username: "admin",
  role: "ROLE_ADMIN",
  issuedAt: new Date().toISOString(),
};

const token = jwt.sign(payload, secretKey, {
  algorithm: "HS512",
  expiresIn: "1h",
});

console.log(`🛡️ Generated JWT Token:\n${token}\n`);

// STEP 3: Verify the JWT using the same secret
try {
  const decoded = jwt.verify(token, secretKey, { algorithms: ["HS512"] });
  console.log("✅ Token successfully verified. Decoded payload:");
  console.log(decoded);
} catch (err) {
  console.error("❌ Token verification failed:", err.message);
}
