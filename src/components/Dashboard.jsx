import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import Navigation from "./Navigation";

const Dashboard = () => {
    const { loading } = useAuth();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    const handleFetchUsers = async () => {
        try {
            setFetchingUsers(true);
            const data = await authAPI.fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setFetchingUsers(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <button
                        onClick={handleFetchUsers}
                        disabled={fetchingUsers}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {fetchingUsers ? "Loading..." : "Fetch user"}
                    </button>

                    {users.length > 0 && (
                        <div className="mt-6">
                            <code className="block rounded-lg bg-gray-100 p-4 text-sm">
                                <pre>{JSON.stringify(users, null, 2)}</pre>
                            </code>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
