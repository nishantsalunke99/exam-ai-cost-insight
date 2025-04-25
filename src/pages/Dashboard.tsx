
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { examResultsData, serverUsageData } from "@/data/mockData";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import LoadingSpinner from "@/components/LoadingSpinner";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" className="border-primary" />
          <p className="text-muted-foreground animate-pulse-opacity">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of exam performance and AWS resource utilization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {examResultsData[examResultsData.length - 1].averageScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              +{examResultsData[examResultsData.length - 1].averageScore - examResultsData[examResultsData.length - 2].averageScore}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(examResultsData[examResultsData.length - 1].passRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +{((examResultsData[examResultsData.length - 1].passRate - examResultsData[examResultsData.length - 2].passRate) * 100).toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">AWS Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serverUsageData[serverUsageData.length - 1].totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Requests in the last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 mt-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Exam Performance</CardTitle>
            <CardDescription>
              Average scores and pass rates over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="scores">
              <TabsList className="mb-4">
                <TabsTrigger value="scores">Average Scores</TabsTrigger>
                <TabsTrigger value="passRates">Pass Rates</TabsTrigger>
              </TabsList>
              <TabsContent value="scores">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={examResultsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,180,180,0.3)" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)'
                        }} 
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="averageScore"
                        name="Average Score (%)"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="passRates">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={examResultsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,180,180,0.3)" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip 
                        formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, "Pass Rate"]}
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)'
                        }} 
                      />
                      <Legend />
                      <Bar
                        dataKey="passRate"
                        name="Pass Rate"
                        fill="hsl(var(--secondary))"
                        animationDuration={2000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>AWS Resource Utilization</CardTitle>
            <CardDescription>
              CPU and memory usage over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={serverUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,180,180,0.3)" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, ""]}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="averageCPU"
                    name="CPU Utilization"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageMemory"
                    name="Memory Utilization"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary) / 0.2)"
                    animationDuration={2000}
                    animationBegin={700}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
