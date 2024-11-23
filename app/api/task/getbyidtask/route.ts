import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/Taskmodel";
import connectDB from "@/utiles/db";
import verifyToken from "@/utiles/verifytoken";
import User from "@/models/Usermodel";


export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
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
        // Check if user is admin/superuser or owns the task
        const isAdminOrSuper = ['admin', 'superuser'].includes(user.role);
        const hasTask = user.tasks?.includes(params.id);

        if (!isAdminOrSuper && !hasTask) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const task = await Task.findById(params.id);
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json(task);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

