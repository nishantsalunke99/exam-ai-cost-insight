
import { awsInstanceTypes } from "../data/mockData";

// Constants for resource requirements per student
const CPU_PER_STUDENT = 0.02; // vCPU per student
const RAM_PER_STUDENT = 0.05; // GB per student
const SAFETY_MARGIN = 1.2; // 20% safety margin for peak loads

/**
 * Calculate AWS instance recommendations based on number of students
 */
export function calculateResourceRequirements(students: number) {
  // Calculate total resource requirements
  const totalCPU = students * CPU_PER_STUDENT * SAFETY_MARGIN;
  const totalRAM = students * RAM_PER_STUDENT * SAFETY_MARGIN;
  
  // Find suitable instance types
  const suitableInstances = awsInstanceTypes.filter(instance => 
    instance.vCPU >= totalCPU && instance.memory >= totalRAM
  );
  
  // Sort by cost (ascending)
  suitableInstances.sort((a, b) => a.costPerHour - b.costPerHour);
  
  // If no suitable instance is found, recommend the largest one
  if (suitableInstances.length === 0) {
    const largestInstance = [...awsInstanceTypes].sort(
      (a, b) => b.memory - a.memory || b.vCPU - a.vCPU
    )[0];
    
    return {
      recommendedInstance: largestInstance,
      resourcesNeeded: {
        cpu: totalCPU,
        memory: totalRAM,
      },
      warning: `Resource requirements exceed our largest instance type. Consider distributing across multiple instances.`,
    };
  }
  
  // Get the most cost-effective suitable instance
  const recommendedInstance = suitableInstances[0];
  
  return {
    recommendedInstance,
    resourcesNeeded: {
      cpu: totalCPU,
      memory: totalRAM,
    },
    unusedResources: {
      cpu: recommendedInstance.vCPU - totalCPU,
      memory: recommendedInstance.memory - totalRAM,
    },
    warning: null,
  };
}

/**
 * Parse CSV data for cost analysis
 */
export function parseCSVData(csvString: string) {
  try {
    const lines = csvString.split('\n');
    if (lines.length < 2) {
      throw new Error("CSV file must contain at least a header row and one data row.");
    }
    
    // Analyze header row
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Find critical columns
    const universityIndex = headers.findIndex(h => h.includes('university') || h.includes('institution'));
    const subjectIndex = headers.findIndex(h => h.includes('subject') || h.includes('course'));
    const studentsIndex = headers.findIndex(h => 
      h.includes('student') || h.includes('enrollment') || h.includes('count')
    );
    
    if (universityIndex === -1 || subjectIndex === -1 || studentsIndex === -1) {
      throw new Error("CSV must contain columns for university, subject, and student count.");
    }
    
    // Parse data row (use the first data row for simplicity)
    const dataRow = lines[1].split(',').map(cell => cell.trim());
    
    return {
      universityName: dataRow[universityIndex],
      subject: dataRow[subjectIndex],
      students: parseInt(dataRow[studentsIndex], 10),
      isValid: !isNaN(parseInt(dataRow[studentsIndex], 10))
    };
  } catch (error) {
    console.error("CSV parsing error:", error);
    throw new Error("Failed to parse CSV file. Please ensure it has the correct format.");
  }
}
