"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const authService = __importStar(require("./auth.service"));
// POST /api/auth/register
exports.register = (0, catchAsync_1.default)(async (req, res) => {
    const dto = {
        email: req.body.email,
        full_name: req.body.full_name,
        password: req.body.password,
    };
    const result = await authService.registerUser(dto);
    res.status(200).json(result);
});
// POST /api/auth/login
exports.login = (0, catchAsync_1.default)(async (req, res) => {
    const dto = {
        email: req.body.email,
        password: req.body.password,
    };
    const result = await authService.loginUser(dto);
    res.status(200).json(result);
});
// GET /api/auth/me
exports.getMe = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const user = await authService.getMe(userId);
    res.status(200).json(user);
});
// PATCH /api/auth/profile
exports.updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.user_id;
    const dto = {
        full_name: req.body.full_name,
        email: req.body.email,
        current_password: req.body.current_password,
        new_password: req.body.new_password,
    };
    const updated = await authService.updateProfile(userId, dto);
    res.status(200).json(updated);
});
//# sourceMappingURL=auth.controller.js.map