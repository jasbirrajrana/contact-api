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
exports.UserResolver = void 0;
const UserSchema_1 = __importStar(require("../schema/UserSchema"));
const argon2 = __importStar(require("argon2"));
const UserResponse_1 = require("../types/UserResponse");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("../types/constants");
class UserResolver {
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        console.log(req.session.userId);
        return UserSchema_1.default.findById(req.session.userId);
    }
    register(name, email, password, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            let isUserExist = yield UserSchema_1.default.findOne({ email });
            if (isUserExist) {
                return {
                    errors: [
                        {
                            field: "Email",
                            message: "Email Already Registered!",
                        },
                    ],
                };
            }
            if (password.length <= 4) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password length must be greater than 4",
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2.hash(password);
            let user;
            try {
                user = yield UserSchema_1.default.create({
                    name,
                    email,
                    password: hashedPassword,
                });
            }
            catch (error) {
                throw new Error(error);
            }
            req.session.userId = user._id;
            return { user };
        });
    }
    login(email, password, { req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield UserSchema_1.default.findOne({ email });
            if (userExist === null) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "could not find a user with provided Email id!",
                        },
                    ],
                };
            }
            const valid = yield argon2.verify(userExist.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "password is not matching!",
                        },
                    ],
                };
            }
            console.log(userExist);
            req.session.userId = userExist._id;
            console.log(req.session);
            return {
                user: userExist,
            };
        });
    }
}
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    type_graphql_1.Query(() => UserSchema_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("name", () => String)),
    __param(1, type_graphql_1.Arg("email", () => String)),
    __param(2, type_graphql_1.Arg("password", () => String)),
    __param(3, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse_1.UserResponse),
    __param(0, type_graphql_1.Arg("email", () => String)),
    __param(1, type_graphql_1.Arg("password", () => String)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map