import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default redirect */}
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />

                        {/* Catch all route */}
                        <Route
                            path="*"
                            element={<Navigate to="/dashboard" replace />}
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
