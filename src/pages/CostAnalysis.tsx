
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { subjects, universities } from "@/data/mockData";
import { calculateResourceRequirements, parseCSVData } from "@/utils/costAnalysis";
import { useHistory } from "@/contexts/HistoryContext";

const CostAnalysis = () => {
  const { toast } = useToast();
  const { addRecord } = useHistory();
  const [formState, setFormState] = useState({
    universityName: "",
    subject: "",
    students: 100,
  });
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultsCard, setShowResultsCard] = useState(false);

  // For file upload
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessingFile(true);
    
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const csvData = reader.result as string;
        const parsedData = parseCSVData(csvData);
        
        if (parsedData.isValid) {
          setFormState({
            universityName: parsedData.universityName,
            subject: parsedData.subject,
            students: parsedData.students,
          });
          
          toast({
            title: "CSV File Processed",
            description: `Loaded data for ${parsedData.universityName} with ${parsedData.students} students.`,
          });
        } else {
          toast({
            title: "Invalid CSV Format",
            description: "Could not extract all required data. Please check your CSV format.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error processing CSV:", error);
        toast({
          title: "Error Processing File",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsProcessingFile(false);
      }
    };
    
    reader.readAsText(file);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
  });

  const handleInputChange = (name: keyof typeof formState, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = async () => {
    if (!formState.universityName || !formState.subject || formState.students <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setShowResultsCard(false);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const calculationResult = calculateResourceRequirements(formState.students);
      setResult(calculationResult);
      setShowResultsCard(true);
      
      // Add to history
      addRecord({
        universityName: formState.universityName,
        subject: formState.subject,
        students: formState.students,
        recommendedInstance: calculationResult.recommendedInstance.type,
        estimatedCost: calculationResult.recommendedInstance.costPerHour,
      });
      
      toast({
        title: "Analysis Complete",
        description: "AWS resource requirements calculated successfully.",
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "An error occurred during the calculation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cost Analysis</h1>
        <p className="text-muted-foreground">
          Calculate AWS resource requirements for exam hosting
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>
              Enter information about the exam to generate cost estimates
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* University Name */}
            <div className="space-y-2">
              <Label htmlFor="universityName">University Name</Label>
              <Select 
                value={formState.universityName} 
                onValueChange={(value) => handleInputChange("universityName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={formState.subject} 
                onValueChange={(value) => handleInputChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Students */}
            <div className="space-y-2">
              <Label htmlFor="students">Number of Students</Label>
              <Input
                id="students"
                type="number"
                min="1"
                value={formState.students}
                onChange={(e) => handleInputChange("students", parseInt(e.target.value) || 0)}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload CSV Data (Optional)</Label>
              <div 
                {...getRootProps()} 
                className={`drag-area ${isDragActive ? "drag-active" : ""}`}
              >
                <input {...getInputProps()} />
                {isProcessingFile ? (
                  <div className="text-center space-y-3">
                    <LoadingSpinner size="md" className="mx-auto" />
                    <p>Processing file...</p>
                  </div>
                ) : isDragActive ? (
                  <p>Drop the CSV file here ...</p>
                ) : (
                  <div className="text-center">
                    <p className="mb-2">Drag and drop a CSV file here, or click to select a file</p>
                    <p className="text-xs text-muted-foreground">
                      CSV should contain columns for university, subject, and student count
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              onClick={handleCalculate} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Calculating...
                </span>
              ) : (
                "Calculate Cost"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Results Card (conditionally rendered) */}
        {showResultsCard && result && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                AWS resource recommendations for {formState.students} students
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Recommended Instance</h3>
                <p className="text-2xl font-bold text-primary mt-1">
                  {result.recommendedInstance.type}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.recommendedInstance.vCPU} vCPU, {result.recommendedInstance.memory} GB RAM
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Cost Estimate</h3>
                <p className="text-2xl font-bold text-secondary">
                  ${result.recommendedInstance.costPerHour.toFixed(4)}
                </p>
                <p className="text-sm text-muted-foreground">
                  per hour (${(result.recommendedInstance.costPerHour * 24).toFixed(2)} per day)
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Resource Requirements</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Utilization</span>
                      <span>
                        {result.resourcesNeeded.cpu.toFixed(2)}/{result.recommendedInstance.vCPU} vCPU
                      </span>
                    </div>
                    <Progress 
                      value={
                        (result.resourcesNeeded.cpu / result.recommendedInstance.vCPU) * 100
                      } 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Utilization</span>
                      <span>
                        {result.resourcesNeeded.memory.toFixed(2)}/{result.recommendedInstance.memory} GB
                      </span>
                    </div>
                    <Progress 
                      value={
                        (result.resourcesNeeded.memory / result.recommendedInstance.memory) * 100
                      } 
                    />
                  </div>
                </div>
              </div>

              {result.warning && (
                <Alert variant="destructive">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>{result.warning}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">
                Calculation includes a 20% safety margin
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CostAnalysis;
