
// Mock data for the dashboard charts

// University exam results data (past 6 months)
export const examResultsData = [
  { month: "Jan", averageScore: 72, passRate: 0.68 },
  { month: "Feb", averageScore: 70, passRate: 0.65 },
  { month: "Mar", averageScore: 75, passRate: 0.71 },
  { month: "Apr", averageScore: 73, passRate: 0.69 },
  { month: "May", averageScore: 78, passRate: 0.76 },
  { month: "Jun", averageScore: 80, passRate: 0.82 },
];

// AWS server usage data (past week)
export const serverUsageData = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [];

  // Generate data for each day
  for (let i = 0; i < 7; i++) {
    // Base values with some randomization
    const baseMemory = 0.5 + Math.random() * 0.2;
    const baseCPU = 0.3 + Math.random() * 0.3;

    // Add hourly data (24 hours)
    const hourlyData = [];
    for (let h = 0; h < 24; h++) {
      // Create daily patterns with higher usage during business hours
      const timeMultiplier = h >= 9 && h <= 18 
        ? 1 + (Math.random() * 0.5) // Business hours (9am-6pm)
        : 0.5 + (Math.random() * 0.3); // Off hours
      
      hourlyData.push({
        hour: h,
        cpuUtilization: baseCPU * timeMultiplier,
        memoryUtilization: baseMemory * timeMultiplier,
        requestCount: Math.floor(20 * timeMultiplier * (1 + Math.random() * 0.5)),
      });
    }

    data.push({
      day: days[i],
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hourlyData,
      averageCPU: hourlyData.reduce((sum, h) => sum + h.cpuUtilization, 0) / 24,
      averageMemory: hourlyData.reduce((sum, h) => sum + h.memoryUtilization, 0) / 24,
      totalRequests: hourlyData.reduce((sum, h) => sum + h.requestCount, 0),
    });
  }

  return data;
})();

// AWS instance types and pricing (simplified)
export const awsInstanceTypes = [
  { type: "t3.micro", vCPU: 2, memory: 1, costPerHour: 0.0104 },
  { type: "t3.small", vCPU: 2, memory: 2, costPerHour: 0.0208 },
  { type: "t3.medium", vCPU: 2, memory: 4, costPerHour: 0.0416 },
  { type: "t3.large", vCPU: 2, memory: 8, costPerHour: 0.0832 },
  { type: "m5.large", vCPU: 2, memory: 8, costPerHour: 0.096 },
  { type: "m5.xlarge", vCPU: 4, memory: 16, costPerHour: 0.192 },
  { type: "m5.2xlarge", vCPU: 8, memory: 32, costPerHour: 0.384 },
  { type: "c5.large", vCPU: 2, memory: 4, costPerHour: 0.085 },
  { type: "c5.xlarge", vCPU: 4, memory: 8, costPerHour: 0.17 },
  { type: "c5.2xlarge", vCPU: 8, memory: 16, costPerHour: 0.34 },
];

// Subjects for dropdown
export const subjects = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
];

// Universities for dropdown
export const universities = [
  "Massachusetts Institute of Technology",
  "Stanford University",
  "Harvard University",
  "California Institute of Technology",
  "University of Oxford",
  "University of Cambridge",
  "ETH Zurich",
  "University of California, Berkeley",
  "Imperial College London",
  "National University of Singapore",
];
