import dbConnect from "@/lib/dbConnect";
import ConferenceModel from "@/model/ConferenceSchema";

export async function GET(request: Request) {
    await dbConnect();

    try {
        // Fetch all conferences from the database
        const getConferenceDetails = await ConferenceModel.find();

        // If no conferences are found, return an error response
        if (!getConferenceDetails) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Conference details not found",
                }),
                { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } } // Disable caching
            );
        }

        // Return the conference details with a success response
        return new Response(
            JSON.stringify({
                success: true,
                message: "Conference details found",
                data: getConferenceDetails,
            }),
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error occurred while fetching conference details",
            }),
            {
                status: 500,
                headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
            }
        );
    }
}