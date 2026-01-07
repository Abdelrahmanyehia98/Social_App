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
exports.authentication = void 0;
const Utils_1 = require("../Utils");
const Repositories_1 = require("../DB/Repositories");
const Models_1 = require("../DB/Models");
const userRepo = new Repositories_1.UserRepository(Models_1.UserModel);
const blackListedRepo = new Repositories_1.BlackListedRepository(Models_1.BlacklistedTokensModel);
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization: accessToken } = req.headers;
    if (!accessToken)
        return res.status(401).json({ message: 'please login first' });
    const [prefix, token] = accessToken.split(' ');
    if (prefix !== process.env.JWT_PREFIX)
        return res.status(401).json({ message: 'invalid token' });
    const decodedData = (0, Utils_1.verifyToken)(token, process.env.JWT_ACCESS_SECRET);
    if (!decodedData._id)
        return res.status(401).json({ message: 'invalid payload' });
    const blacklistedToken = yield blackListedRepo.findOneDocument({ tokenId: decodedData.jti });
    if (blacklistedToken)
        return res.status(401).json({ message: 'Your session has been expired please login again' });
    const user = yield userRepo.findDocumentById(decodedData._id, '-password');
    if (!user)
        return res.status(404).json({ message: 'Please register first' });
    req.loggedInUser = { user, token: decodedData };
    return next();
});
exports.authentication = authentication;
