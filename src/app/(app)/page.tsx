"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Page = () => {
  const [statistics, setStatistics] = useState({
    totalConferences: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    verifiedUsers: 0,
    upcomingConferences: 0,
    conferencesAcceptingPapers: 0,
  });

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const [conferencesResponse, usersResponse] = await Promise.all([
          fetch("/api/get-all-conferences"),
          fetch("/api/get-all-users"),
        ]);

        if (!conferencesResponse.ok || !usersResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const conferencesData = await conferencesResponse.json();
        const usersData = await usersResponse.json();

        // Extract the `data` field from the API responses
        const conferences = conferencesData.data;
        const users = usersData.data;

        // Calculate statistics
        const today = new Date();
        const upcomingConferences = conferences.filter((conf: any) => {
          const firstDay = new Date(conf.conferenceFirstDay);
          const timeDifference = firstDay.getTime() - today.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);
          return daysDifference > 0 && daysDifference <= 30;
        }).length;

        const conferencesAcceptingPapers = conferences.filter(
          (conf: any) => conf.conferenceIsAcceptingPaper
        ).length;

        const verifiedUsersCount = users.filter((user: any) => user.isVerified).length;

        setStatistics({
          totalConferences: conferences.length,
          totalUsers: users.length,
          pendingApprovals: conferences.filter((conf: any) => conf.conferenceStatus !== "accepted").length,
          verifiedUsers: verifiedUsersCount,
          upcomingConferences,
          conferencesAcceptingPapers,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-16">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">MYCONF Admin Panel</h1>
        {/* <p className="text-gray-600 mb-8">
          Manage conferences, users, and system settings.
        </p> */}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Conferences Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Conferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalConferences}</p>
            <p className="text-sm text-gray-500">Conferences organized</p>
          </CardContent>
        </Card>

        {/* Total Users Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalUsers}</p>
            <p className="text-sm text-gray-500">Registered users</p>
          </CardContent>
        </Card>

        {/* Pending Approvals Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.pendingApprovals}</p>
            <p className="text-sm text-gray-500">Conferences awaiting approval</p>
          </CardContent>
        </Card>

        {/* Verified Users Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Verified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.verifiedUsers}</p>
            <p className="text-sm text-gray-500">Verified user accounts</p>
          </CardContent>
        </Card>

        {/* Upcoming Conferences Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Conferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.upcomingConferences}</p>
            <p className="text-sm text-gray-500">Starting in the next 30 days</p>
          </CardContent>
        </Card>

        {/* Conferences Accepting Papers Card */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Conferences Accepting Papers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.conferencesAcceptingPapers}</p>
            <p className="text-sm text-gray-500">Currently accepting submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Manage Conferences */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Manage Conferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              View, edit, and approve conferences. Keep track of submissions and updates.
            </p>
            <Link href="/conferences">
              <Button variant="default" className="w-full">
                Go to Conferences
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Manage Users */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              View, add, and manage user accounts and permissions.
            </p>
            <Link href="/users">
              <Button variant="default" className="w-full">
                Go to Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Configure application settings, manage roles, and other admin tasks.
            </p>
            <Link href="/settings">
              <Button variant="default" className="w-full">
                Go to Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer Section */}
      <div className="text-center mt-16">
        <p className="text-gray-500">Powered by MYCONF</p>
      </div>
    </div>
  );
};

export default Page;