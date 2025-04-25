
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HistoryProvider } from "@/contexts/HistoryContext";

import PageLayout from "@/components/PageLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CostAnalysis from "@/pages/CostAnalysis";
import History from "@/pages/History";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          <TooltipProvider>
            <BrowserRouter>
              <PageLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/cost-analysis" 
                    element={
                      <ProtectedRoute>
                        <CostAnalysis />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/history" 
                    element={
                      <ProtectedRoute>
                        <History />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PageLayout>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
