"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackListedRepository = void 0;
const base_repository_1 = require("./base.repository");
class BlackListedRepository extends base_repository_1.BaseRepository {
    constructor(_blacklistedTokensModel) {
        super(_blacklistedTokensModel);
        this._blacklistedTokensModel = _blacklistedTokensModel;
    }
}
exports.BlackListedRepository = BlackListedRepository;
