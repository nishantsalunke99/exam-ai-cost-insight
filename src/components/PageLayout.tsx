import React from "react";
import Header from "@/components/Header";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout = ({ children, className }: PageLayoutProps) => {
  // We'll keep the useLocation hook here, but make sure PageLayout is rendered inside Router in App.tsx
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <Header />}
      <main className={cn("flex-1", className)}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
