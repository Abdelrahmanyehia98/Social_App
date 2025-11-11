"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpTypesEnum = exports.ProviderEnum = exports.GenderEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["USER"] = "user";
    RoleEnum["ADMIN"] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
    GenderEnum["OTHER"] = "other";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var ProviderEnum;
(function (ProviderEnum) {
    ProviderEnum["GOOGLE"] = "google";
    ProviderEnum["LOCAL"] = "local";
})(ProviderEnum || (exports.ProviderEnum = ProviderEnum = {}));
var OtpTypesEnum;
(function (OtpTypesEnum) {
    OtpTypesEnum["CONFIRMATION"] = "confirmation";
    OtpTypesEnum["RESET_PASSWORD"] = "reset-password";
})(OtpTypesEnum || (exports.OtpTypesEnum = OtpTypesEnum = {}));
