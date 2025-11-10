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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    createNewDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.create(document);
        });
    }
    findOneDocument(filters, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(filters, projection, options);
        });
    }
    findDocumentById(id, projection, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id, projection, options);
        });
    }
    findDocuments() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, projection, options) {
            return yield this.model.find(filters, projection, options);
        });
    }
    updateOneDocument(filters, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate(filters, updateData, Object.assign({ new: true }, options));
        });
    }
    /* async updateMultipleDocuments(
        filters: FilterQuery<T>,
         updateData: UpdateQuery<T>,
         options?: QueryOptions
     ): Promise<{ matchedCount: number; modifiedCount: number }> {
         const result = await this.model.updateMany(filters, updateData, options);
         return {
             matchedCount: result.matchedCount ?? 0,
             modifiedCount: result.modifiedCount ?? 0,
         };
     }*/
    deleteOneDocument(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndDelete(filters);
        });
    }
    deleteMultipleDocuments(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.model.deleteMany(filters);
            return (_a = result.deletedCount) !== null && _a !== void 0 ? _a : 0;
        });
    }
    findAndUpdateDocument(filters, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate(filters, updateData, Object.assign({ new: true }, options));
        });
    }
    findAndDeleteDocument(filters, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndDelete(filters, options);
        });
    }
}
exports.BaseRepository = BaseRepository;
