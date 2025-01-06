import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ConferenceModel from "@/model/ConferenceSchema";
import UserModel from "@/model/User";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated",
            }),
            {
                status: 401,
                headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
            }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            confName: searchParams.get('confName'),
        };

        const getConferenceDetails = await ConferenceModel.findOne({
            conferenceAcronym: queryParams.confName,
        }).populate('conferenceOrganizer', 'fullname');

        if (!getConferenceDetails) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Conference details not found",
                }),
                {
                    status: 404,
                    headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Conference details found by conference ID",
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
                message: "Error occurred while fetching details for the conference: " + error,
            }),
            {
                status: 500,
                headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
            }
        );
    }
}