import { NextResponse } from 'next/server';
import User from '@/model/User';

export async function DELETE(request: Request) {
    try {
        // Extract the array of user IDs from the request body
        const { ids } = await request.json();

        // Validate the input
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid or empty array of IDs' },
                { status: 400 }
            );
        }

        // Delete the users from the database
        const result = await User.deleteMany({ _id: { $in: ids } });

        // Check if any users were deleted
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'No users found with the provided IDs' },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Users deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting users:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete users' },
            { status: 500 }
        );
    }
}