import connectDB from '@/utiles/db';
import Task from '@/models/Taskmodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';
import User from '@/models/Usermodel';

export const DELETE = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
    try {
        await connectDB();
        const decoded = verifyToken(req);
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
        if (!permission?.includes('delete_task')) {
            return NextResponse.json({
                success: false,
                message: 'Not permitted to delete task'
            }, { status: 403 });
        }

        const task = await Task.findById(params.id);
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        // Remove task ID from all assigned users
        if (task.assignedTo && task.assignedTo.length > 0) {
            await User.updateMany(
                { _id: { $in: task.assignedTo } },
                { $pull: { tasks: task._id } }
            );
        }

        await task.deleteOne();
        return NextResponse.json({ success: true, message: 'Task deleted successfully' }, { status: 200 });

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message });
    }
}