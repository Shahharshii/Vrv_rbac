import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Usermodel';
import connectDB from '@/utiles/db'; // Import your database connection function if needed
import verifyToken from '@/utiles/verifytoken';
import Task from '@/models/Taskmodel';

export const GET = async (req: NextRequest) => {
    try {
        await connectDB();

        // Verify token and extract user data
        const decoded = verifyToken(req);
        if (!('id' in decoded)) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = decoded.id;
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        // Check role and filter tasks accordingly
        if (user.role === 'admin' || user.role === 'superuser') {
            // Get all tasks for admin/superuser
            const allTasks = await Task.find({}).populate('assignedTo', 'username');
            return NextResponse.json({ success: true, tasks: allTasks });
        } else {
            // Get only assigned tasks for regular users
            const userTasks = await Task.find({ assignedTo: userId }).populate('assignedTo', 'username');
            return NextResponse.json({ success: true, tasks: userTasks });
        }

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
};