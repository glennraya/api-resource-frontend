import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";
const Dashboard = () => {
    const { loading } = useAuth();
    const { user } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">{user?.name}</div>
            </main>
        </div>
    );
};

export default Dashboard;
