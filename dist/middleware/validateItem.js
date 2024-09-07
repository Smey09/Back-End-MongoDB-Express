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
exports.validateUpdateItem = exports.validateCreateItem = void 0;
const itemValidator_1 = require("../validators/itemValidator");
const validateCreateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield itemValidator_1.createItemSchema.validate(req.body);
        next();
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});
exports.validateCreateItem = validateCreateItem;
const validateUpdateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield itemValidator_1.updateItemSchema.validate(req.body);
        next();
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});
exports.validateUpdateItem = validateUpdateItem;
