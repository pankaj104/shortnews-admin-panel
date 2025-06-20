import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import FirebaseCheck from "@/components/FirebaseCheck";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import NewsManagement from "@/pages/NewsManagement";
import CategoryManagement from "@/pages/CategoryManagement";
import UserPreferences from "@/pages/UserPreferences";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle initial route redirection
const AuthRedirect = () => {
  const { currentUser } = useAuth()
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <Navigate to="/login" replace />
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="admin-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FirebaseCheck>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<AuthRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="news" element={<NewsManagement />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="users" element={<UserPreferences />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </FirebaseCheck>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
