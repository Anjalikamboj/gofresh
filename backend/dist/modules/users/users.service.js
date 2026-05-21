"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
const auth_model_1 = require("../auth/auth.model");
async function getAllUsers(page, page_size) {
    // Clamp pagination parameters (mirrors Python validation)
    if (page < 1)
        page = 1;
    if (page_size < 1 || page_size > 100)
        page_size = 10;
    const skip = (page - 1) * page_size;
    const total = await auth_model_1.UserModel.countDocuments({});
    const total_pages = Math.ceil(total / page_size);
    const users = await auth_model_1.UserModel.find({})
        .sort({ created_at: -1 }) // Newest first
        .skip(skip)
        .limit(page_size);
    return {
        items: users.map((u) => u.toJSON()),
        page,
        page_size,
        total,
        total_pages,
    };
}
//# sourceMappingURL=users.service.js.map