// pages/api/auth/register.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Usermodel';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '@/utiles/db';



const getUserModel = () => {
    return mongoose.models.User || User;
};

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();
        const UserModel = getUserModel();
        console.log('Received registration request:', {
            ...req.body,
            password: '*' // Hide password in logs
        });

        const { username, password } = await req.json();

        // Validate input
        if (!username || !password) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "User with this username already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        // Create user
        const user = await new UserModel({
            username,
            password: hashedPassword
        }).save();

        console.log('User created successfully:', user._id);

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
            }
        });

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({
            success: false,
            message: message
        });
    }
};

