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
const user_repository_1 = require("../../../DB/Repositories/user.repository");
const Models_1 = require("../../../DB/Models");
const Utils_1 = require("../../../Utils");
class AuthServices {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository(Models_1.UserModel);
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, gender, DOB, phoneNumber } = req.body;
            const isEmailExists = yield this.userRepo.findOneDocument({ email }, 'email');
            if (!isEmailExists)
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
    }
}
exports.default = new AuthServices();
