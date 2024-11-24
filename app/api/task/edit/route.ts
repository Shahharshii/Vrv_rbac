import connectDB from '@/utiles/db';
import Task from '@/models/Taskmodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';


export const PUT = async (req: NextRequest) => {
    try {
        await connectDB();
        const decoded = verifyToken(req);
        let permission
        if ("permission" in decoded) {
            permission = decoded.permission
        } else {
            return NextResponse.json({
                success: false,
                message: 'No permission found'
            }, { status: 403 });
        }

        // Get task and request data
        const { id, ...updateData } = await req.json();

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Task ID is required'
            }, { status: 400 });
        }

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        // Handle complete_task permission
        if (permission?.includes('complete_task')) {
            const updatedTask = await Task.findByIdAndUpdate(
                id,
                { status: updateData.status },
                { new: true, runValidators: true }
            );
            return NextResponse.json({
                success: true,
                message: 'Task status updated successfully',
                task: updatedTask
            });
        }

        // Handle edit_task permission
        if (!permission?.includes('edit_task')) {
            return NextResponse.json({
                success: false,
                message: 'Not permitted to edit task'
            }, { status: 403 });
        }

        // Full task update for edit_task permission
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true, runValidators: true }
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

