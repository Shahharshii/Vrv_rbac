import connectDB from '@/utiles/db';
import User from '@/models/Usermodel';
import { NextRequest, NextResponse } from 'next/server';
import verifyToken from '@/utiles/verifytoken';


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
        if (!permission?.includes('edit_user')) {
            return NextResponse.json({
                success: false,
                message: 'Not permitted to edit user'
            }, { status: 403 });
        }

        // Get id and updateData from body
        const requestData = await req.json();
        const { id, ...updateData } = requestData;

        // Find the user
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error: Error | unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, message });

    }
}

