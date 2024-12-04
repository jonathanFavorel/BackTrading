const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String("your-secret-key"))
  .digest("base64")
  .substr(0, 32);

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return JSON.stringify({ iv: iv.toString("hex"), encryptedData: encrypted });
};

const decrypt = (encrypted) => {
  const parsed = JSON.parse(encrypted);
  if (!parsed || !parsed.iv || !parsed.encryptedData) {
    throw new Error("Invalid encrypted data");
  }
  const iv = Buffer.from(parsed.iv, "hex");
  const encryptedText = Buffer.from(parsed.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encrypt, decrypt };
