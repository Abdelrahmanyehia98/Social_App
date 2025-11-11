"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_1 = require("express");
const auth_service_1 = __importDefault(require("../Services/auth.service"));
const authController = (0, express_1.Router)();
exports.authController = authController;
//sign up
authController.post('/signUp', auth_service_1.default.signUp);
