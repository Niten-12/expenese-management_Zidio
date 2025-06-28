const jwt = require("jsonwebtoken");

// Your token issued by Spring Boot
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzUwNjA4Mzg0LCJleHAiOjE3NTA2MTE5ODR9.ynbXK3uDSY6vGHEMP9P1zlFWcOcWFuZnee2SCuTU7dE"; // your actual token

// Your Base64 secret (same as jwt.secret in application.properties)
const base64Secret = " Krez3Cbxi4AnL/zAg/B6O3DYWbUR+lMRbd8I3ocRIfE=";

// Decode the Base64 secret to bytes (Buffer)
const secretKeyBuffer = Buffer.from(base64Secret, "base64");

try {
  const decoded = jwt.verify(token, secretKeyBuffer, { algorithms: ["HS256"] });
  console.log("✅ Signature verified successfully. Decoded payload:");
  console.log(decoded);
} catch (err) {
  console.error("❌ Signature verification failed:", err.message);
}
