// pages/api/auth/login.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/utiles/db';
import User from '@/models/Usermodel';

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();
        const { username, password } = await req.json();
        if (!username || !password) {
            return NextResponse.json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user || !user.password) {
            return NextResponse.json({ success: false, message: "No user found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    permission: user.permission
                },
                process.env.ACCESS_TOKEN_SECRET as string
            );

            return NextResponse.json({ success: true, token: accessToken, message: "User logged in", user });
        } else {
            return NextResponse.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message });
    }
};

