"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const IV_LENGTH = parseInt(process.env.IV_LENGTH);
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY);
const encrypt = (text) => {
    const iv = node_crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = node_crypto_1.default.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);
    let encryptedData = cipher.update(text, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
    return `${iv.toString('hex')}:${encryptedData}`;
};
exports.encrypt = encrypt;
const decrypt = (encryptData) => {
    const [iv, encryptedText] = encryptData.split(':');
    const binaryLikeIv = Buffer.from(iv, 'hex');
    const decipher = node_crypto_1.default.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, binaryLikeIv);
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
};
exports.decrypt = decrypt;
