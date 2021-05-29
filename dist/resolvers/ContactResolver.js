"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ContactResolver = void 0;
const ContactSchema_1 = __importStar(require("../schema/ContactSchema"));
const type_graphql_1 = require("type-graphql");
let ContactResolver = class ContactResolver {
    createContact(name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield ContactSchema_1.default.create({
                name,
                email,
            });
            if (!contact) {
                return false;
            }
            return true;
        });
    }
    getContacts() {
        return __awaiter(this, void 0, void 0, function* () {
            const contacts = yield ContactSchema_1.default.find({});
            return contacts;
        });
    }
    updateContact(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield ContactSchema_1.default.findOne({ email });
            if (!contact) {
                throw new Error("contact not found!");
            }
            if (contact) {
                contact.name = name || contact.name;
                contact.updatedAt = new Date();
            }
            const updatedContact = yield contact.save();
            return updatedContact;
        });
    }
    deleteContact(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield ContactSchema_1.default.findOne({ email });
            if (!contact) {
                throw new Error("Contact not found!");
            }
            try {
                yield ContactSchema_1.default.deleteOne({ email }, function (err) {
                    if (err)
                        return false;
                });
            }
            catch (error) {
                console.log(error);
                return false;
            }
            return true;
        });
    }
    getContactByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const contacts = yield ContactSchema_1.default.find({ name });
            if (!contacts) {
                throw new Error("Contacts not found!");
            }
            return contacts;
        });
    }
    getContactByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const contacts = yield ContactSchema_1.default.find({ email });
            if (!contacts) {
                throw new Error("Contacts not found!");
            }
            return contacts;
        });
    }
    searchContact(keyword, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultPerPage = 10;
            page = page - 1;
            let searchingOnject = keyword
                ? {
                    email: {
                        $regex: keyword,
                        $options: "i",
                    },
                }
                : {};
            let contacts = yield ContactSchema_1.default.find(Object.assign({}, searchingOnject))
                .limit(resultPerPage)
                .skip(resultPerPage * page);
            if (!contacts) {
                throw new Error("Contact not found!");
            }
            return contacts;
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("name", () => String)),
    __param(1, type_graphql_1.Arg("email", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "createContact", null);
__decorate([
    type_graphql_1.Query(() => [ContactSchema_1.Contact]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContacts", null);
__decorate([
    type_graphql_1.Mutation(() => ContactSchema_1.Contact),
    __param(0, type_graphql_1.Arg("email", () => String)),
    __param(1, type_graphql_1.Arg("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "updateContact", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("email", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "deleteContact", null);
__decorate([
    type_graphql_1.Query(() => [ContactSchema_1.Contact]),
    __param(0, type_graphql_1.Arg("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContactByName", null);
__decorate([
    type_graphql_1.Query(() => [ContactSchema_1.Contact]),
    __param(0, type_graphql_1.Arg("email", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "getContactByEmail", null);
__decorate([
    type_graphql_1.Query(() => [ContactSchema_1.Contact]),
    __param(0, type_graphql_1.Arg("keyword", () => String)),
    __param(1, type_graphql_1.Arg("page", () => Number, { defaultValue: 1 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ContactResolver.prototype, "searchContact", null);
ContactResolver = __decorate([
    type_graphql_1.ObjectType()
], ContactResolver);
exports.ContactResolver = ContactResolver;
//# sourceMappingURL=ContactResolver.js.map