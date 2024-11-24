import connectDB from '@/utiles/db';
import Task from '@/models/Taskmodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';
import User from '@/models/Usermodel';

export const DELETE = async (req: NextRequest) => {
    try {
        await connectDB();
        const decoded = verifyToken(req);
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'User ID is required'
            }, { status: 400 });
        }

        let permission
        if ("permission" in decoded) {
            permission = decoded.permission
            console.log(permission)

        }
        else {
            return NextResponse.json({
                success: false,
                message: 'No permission found'
            }, { status: 403 });
        }
        if (!permission?.includes('delete_user')) {
            return NextResponse.json({
                success: false,
                message: 'Not permitted to delete user'
            }, { status: 403 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Remove task ID from all assigned users
        if (user.tasks && user.tasks.length > 0) {
            await Task.updateMany(
                { assignedTo: user._id },
                { $set: { assignedTo: null } }
            );
        }

        await user.deleteOne();
        return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message });
    }
}