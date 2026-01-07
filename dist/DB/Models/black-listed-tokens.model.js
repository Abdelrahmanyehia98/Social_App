"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistedTokensModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blackListedTokenSchema = new mongoose_1.default.Schema({
    tokenId: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});
const BlacklistedTokensModel = mongoose_1.default.model("BlackListedTokens", blackListedTokenSchema);
exports.BlacklistedTokensModel = BlacklistedTokensModel;
