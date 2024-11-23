import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Usermodel';
import connectDB from '@/utiles/db'; // Import your database connection function if needed
import verifyToken from '@/utiles/verifytoken';

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        // Verify token and extract user data
        const decoded = verifyToken(req);
        if ('id' in decoded) {
            const userId = decoded.id;
            const user = await User.findById(userId);
            return NextResponse.json(user, { status: 200 });
        }

        return NextResponse.json({ message: 'token not received' }, { status: 401 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};