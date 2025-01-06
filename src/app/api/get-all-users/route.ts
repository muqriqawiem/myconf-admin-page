import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
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
        const getUserDetails = await UserModel.find();

        if (!getUserDetails) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Error occurred while fetching all user details",
                }),
                {
                    status: 500,
                    headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Users found for the conference",
                data: getUserDetails,
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
                message: "Error occurred while fetching users",
            }),
            {
                status: 500,
                headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
            }
        );
    }
}