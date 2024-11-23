import connectDB from '@/utiles/db';
import Task from '@/models/Taskmodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';


export const PUT = async (req: NextRequest, { params }: { params: { id: string[] } }) => {
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
        if (!permission?.includes('edit_task')) {
            return NextResponse.json({
                success: false,
                message: 'Not permitted to edit task'
            }, { status: 403 });
        }

        // Get id from URL parameters and updateData from body
        const task = await Task.findById(params.id);
        const updateData = await req.json();
        const id = params.id;
        // Find and update the task

        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

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

