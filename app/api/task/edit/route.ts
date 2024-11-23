import connectDB from '@/utiles/db';
import Task from '@/models/Taskmodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';
import User from '@/models/Usermodel';

export const PUT = async (req: NextRequest) => {
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

        const { id, userId, ...updateData } = await req.json();

        // Find and update the task
        const task = await Task.findById(id);
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true, runValidators: true }
        );

        // Update the task in user's tasks array
        await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "tasks.$[task]": updatedTask
                }
            },
            {
                arrayFilters: [{ "task._id": id }],
                new: true
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask
        });

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message });

    }
}

