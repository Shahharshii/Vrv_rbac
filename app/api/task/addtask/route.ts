import connectDB from '@/utiles/db';
import Task from '@/models/Taskmodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';
import User from '@/models/Usermodel';

export const POST = async (req: NextRequest) => {
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
        if (!permission?.includes('add_task')) {
            return NextResponse.json({
                success: false,
                message: 'Not permitted to add task'
            }, { status: 403 });
        }

        const { title, description, assignedTo } = await req.json();
        const users = await User.find({ _id: { $in: assignedTo } });

        console.log(users)
        if (users.length !== assignedTo.length) {
            return NextResponse.json({
                success: false,
                message: 'One or more users not found'
            }, { status: 401 });

        }

        const task = new Task({
            title,
            description,
            assignedTo
        });
        await task.save();
        users.forEach(user => {
            user.tasks.push(task._id);
            user.save();
        });
        return NextResponse.json({ success: true, message: 'Task created successfully', task }, { status: 201 });

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message });
    }
}

