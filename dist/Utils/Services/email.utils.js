"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localEmitter = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_events_1 = require("node:events");
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, cc, subject, content, attachments = [] }) {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
    });
    const info = yield transporter.sendMail({
        from: `No-reply < ${process.env.USER_EMAIL}>`,
        to,
        cc,
        subject,
        html: content,
        attachments: []
    });
    return info;
});
exports.sendEmail = sendEmail;
exports.localEmitter = new node_events_1.EventEmitter();
exports.localEmitter.on('sendEmail', (args) => {
    console.log('the sending Email event is started');
    (0, exports.sendEmail)(args);
});
