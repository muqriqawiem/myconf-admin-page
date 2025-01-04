import { NextResponse } from 'next/server';
import Conference from '@/model/ConferenceSchema';

export async function DELETE(request: Request) {
    try {
        // Extract the array of conference IDs from the request body
        const { ids } = await request.json();

        // Validate the input
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid or empty array of IDs' },
                { status: 400 }
            );
        }

        // Delete the conferences from the database
        const result = await Conference.deleteMany({ _id: { $in: ids } });

        // Check if any conferences were deleted
        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'No conferences found with the provided IDs' },
                { status: 404 }
            );
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Conferences deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Error deleting conferences:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete conferences' },
            { status: 500 }
        );
    }
}