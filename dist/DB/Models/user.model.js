"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Common_1 = require("../../Common");
const UserSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [4, 'First Name must be at least 4 characters long']
    },
    lastName: {
        type: String,
        required: true,
        minlength: [4, 'First Name must be at least 4 characters long']
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: 'idx_email_unique'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Common_1.RoleEnum,
        default: Common_1.RoleEnum.USER
    },
    gender: {
        type: String,
        enum: Common_1.GenderEnum,
        default: Common_1.GenderEnum.OTHER
    },
    DOB: String,
    profilePicture: String,
    coverPicture: String,
    provider: {
        type: String,
        enum: Common_1.ProviderEnum,
        default: Common_1.ProviderEnum.LOCAL
    },
    googleId: String,
    phoneNumber: String
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.UserModel = UserModel;
