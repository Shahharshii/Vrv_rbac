import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Usermodel';
import connectDB from '@/utiles/db'; // Import your database connection function if needed
import verifyToken from '@/utiles/verifytoken';


export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        const decoded = verifyToken(req);
        if (!('id' in decoded)) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (user.role === 'admin' || user.role === 'superuser') {
            // Get all users with their tasks populated
            const allUsers = await User.find({}).populate('tasks');
            return NextResponse.json({ success: true, users: allUsers });
        } else {
            // Regular users are not permitted to view all users
            return NextResponse.json(
                { success: false, message: 'Not authorized to view all users' },
                { status: 403 }
            );
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};