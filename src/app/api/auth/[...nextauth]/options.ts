import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    // Check if credentials are provided
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required");
                    }

                    // Validate credentials
                    if (
                        credentials.email === process.env.NEXT_AUTH_EMAIL &&
                        credentials.password === process.env.NEXT_AUTH_PASSWORD
                    ) {
                        return {
                            email: credentials.email,
                            fullname: "Admin" // Add a fullname if needed
                        };
                    } else {
                        throw new Error("Invalid email or password");
                    }
                } catch (error: any) {
                    throw new Error(error.message || "Login failed");
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.email = token.email;
                session.user.fullname = token.fullname;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.fullname = user.fullname;
            }
            return token;
        }
    },
    pages: {
        signIn: '/sign-in', // Ensure this route exists in your app
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET // Ensure this is set in your environment variables
};
