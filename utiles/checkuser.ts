import mongoose from "mongoose";

export const checkUserRole = async (userId: string) => {
    const user = await mongoose.model('User').findById(userId);
    return { role: user?.role, permission: user?.permission };
}

