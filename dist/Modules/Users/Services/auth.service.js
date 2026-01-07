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
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("../../../Common");
const Repositories_1 = require("../../../DB/Repositories");
const Models_1 = require("../../../DB/Models");
const Utils_1 = require("../../../Utils");
const crypto_1 = require("crypto");
class AuthServices {
    constructor() {
        this.userRepo = new Repositories_1.UserRepository(Models_1.UserModel);
        this.blackListedRepo = new Repositories_1.BlackListedRepository(Models_1.BlacklistedTokensModel);
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, gender, DOB, phoneNumber } = req.body;
            const isEmailExists = yield this.userRepo.findOneDocument({ email }, 'email');
            if (isEmailExists)
                return res.status(400).json({ message: 'email already exists' });
            const encryptedPhoneNumber = (0, Utils_1.encrypt)(phoneNumber);
            const hashedPassword = (0, Utils_1.generateHash)(password);
            // Send OTP
            const otp = Math.floor(Math.random() * 1000000).toString();
            Utils_1.localEmitter.emit('sendEmail', {
                to: email,
                subject: 'Otp for Sign up',
                content: `Your OTP is ${otp}`
            });
            const confirmationOtp = {
                value: (0, Utils_1.generateHash)(otp),
                expiresAt: Date.now() + 600000,
                otpType: Common_1.OtpTypesEnum.CONFIRMATION
            };
            const newUser = yield this.userRepo.createNewDocument({
                firstName, lastName, email, password: hashedPassword,
                gender, DOB,
                phoneNumber: encryptedPhoneNumber,
                OTPS: [confirmationOtp]
            });
            return res.status(201).json({ message: 'user created successfully', data: { newUser } });
        });
        this.SignIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield this.userRepo.findOneDocument({ email });
            if (!user)
                return res.status(401).json({ message: 'Email/password is incorrect' });
            const isPasswordMatched = (0, Utils_1.compareHash)(password, user.password);
            if (!isPasswordMatched)
                return res.status(401).json({ message: 'Email/password is incorrect' });
            const accessToken = (0, Utils_1.generateToken)({
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            }, process.env.JWT_ACCESS_SECRET, {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
                jwtid: (0, crypto_1.randomUUID)(),
            });
            const refreshToken = (0, Utils_1.generateToken)({
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            }, process.env.JWT_REFRESH_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
                jwtid: (0, crypto_1.randomUUID)(),
            });
            return res.status(200).json({ message: 'User logged in successfully', data: { tokens: { accessToken, refreshToken } } });
        });
        this.ConfirmEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }
            const user = yield this.userRepo.findOneDocument({
                email,
                isVerified: false,
            });
            if (!user)
                return res.status(409).json({
                    message: "invalid Email",
                    data: { invalidEmail: email },
                });
            const confirmationOtp = (_a = user.OTPS) === null || _a === void 0 ? void 0 : _a.find((otpItem) => otpItem.otpType === Common_1.OtpTypesEnum.CONFIRMATION);
            if (!confirmationOtp) {
                return res.status(400).json({ message: "No confirmation OTP found" });
            }
            const isOtpMatched = (0, Utils_1.compareHash)(otp, confirmationOtp.value);
            if (!isOtpMatched) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
            user.isVerified = true;
            user.OTPS = (_b = user.OTPS) === null || _b === void 0 ? void 0 : _b.filter((otpItem) => otpItem.otpType !== Common_1.OtpTypesEnum.CONFIRMATION);
            yield user.save();
            return res.status(201).json({ message: "User confirmed succesfully" });
        });
        this.logOut = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token: { jti, exp } } = req.loggedInUser;
            const blackListedToken = yield this.blackListedRepo.createNewDocument({
                tokenId: jti, expiresAt: new Date(exp || Date.now() + 600000)
            });
            res.status(200).json({ message: 'User logged out successfully', data: { blackListedToken } });
        });
    }
}
exports.default = new AuthServices();
