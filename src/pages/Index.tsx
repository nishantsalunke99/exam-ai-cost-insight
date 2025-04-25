
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-b from-background to-muted py-20 md:py-32">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              ExamCost<span className="text-primary">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12 max-w-3xl mx-auto">
              Optimize your AWS resources for exam hosting with AI-powered cost prediction and analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/cost-analysis">Run Cost Analysis</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="#features">Learn More</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border rounded-lg p-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Precise Cost Prediction</h3>
                <p className="text-muted-foreground">
                  Our AI model predicts AWS resource needs based on student count and
                  exam type, ensuring optimal resource allocation.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="p-3 rounded-full bg-secondary/10 w-fit mb-4">
                  <svg
                    className="w-6 h-6 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Interactive Dashboard</h3>
                <p className="text-muted-foreground">
                  Visualize exam performance and resource utilization patterns with
                  interactive charts and real-time data.
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">CSV Data Import</h3>
                <p className="text-muted-foreground">
                  Easily upload student data via CSV files for quick analysis and
                  cost estimation with drag-and-drop support.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Get Started Today</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join universities worldwide that use ExamCostAI to optimize their AWS
              resource allocation for online examinations.
            </p>
            <div className="text-center">
              <Button asChild size="lg">
                <Link to={isAuthenticated ? "/cost-analysis" : "/login"}>
                  {isAuthenticated ? "Run Cost Analysis" : "Sign In to Get Started"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} ExamCostAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
