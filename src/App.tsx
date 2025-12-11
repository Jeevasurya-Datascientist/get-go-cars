import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { CarsPage } from "./pages/CarsPage";
import { CarDetailPage } from "./pages/CarDetailPage";
import { BookingConfirmPage } from "./pages/BookingConfirmPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { BookingsPage } from "./pages/BookingsPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCarsPage } from "./pages/admin/AdminCarsPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleAuth = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={<Index user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/cars" 
              element={<CarsPage user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/cars/:id" 
              element={<CarDetailPage user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/auth" 
              element={
                user ? (
                  <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
                ) : (
                  <AuthPage onAuth={handleAuth} />
                )
              } 
            />

            {/* Customer routes */}
            <Route 
              path="/booking/confirm" 
              element={<BookingConfirmPage user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/booking/success" 
              element={<BookingSuccessPage user={user} onLogout={handleLogout} />} 
            />
            <Route 
              path="/bookings" 
              element={
                user ? (
                  <BookingsPage user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />

            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                user?.role === 'admin' ? (
                  <AdminDashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />
            <Route 
              path="/admin/cars" 
              element={
                user?.role === 'admin' ? (
                  <AdminCarsPage user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />
            <Route 
              path="/admin/bookings" 
              element={
                user?.role === 'admin' ? (
                  <AdminBookingsPage user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
