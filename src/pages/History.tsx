
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useHistory, CostAnalysisRecord } from "@/contexts/HistoryContext";
import { format, parse, isValid, getMonth } from "date-fns";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const History = () => {
  const { records, clearHistory } = useHistory();
  const [filters, setFilters] = useState({
    university: "all-universities",
    subject: "all-subjects",
    students: "",
    month: "all-months",
    date: "",
  });

  // Extract unique universities and subjects for filter dropdowns
  const uniqueUniversities = useMemo(() => {
    return Array.from(new Set(records.map(record => record.universityName)));
  }, [records]);

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(records.map(record => record.subject)));
  }, [records]);

  // Apply filters to records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordDate = new Date(record.timestamp);
      const recordMonth = MONTHS[getMonth(recordDate)];
      
      // Parse the date filter if it exists
      let dateMatch = true;
      if (filters.date) {
        const filterDate = parse(filters.date, "yyyy-MM-dd", new Date());
        const recordDateOnly = new Date(
          recordDate.getFullYear(),
          recordDate.getMonth(),
          recordDate.getDate()
        );
        dateMatch = isValid(filterDate) && 
          filterDate.getTime() === recordDateOnly.getTime();
      }
      
      return (
        (filters.university === "all-universities" || record.universityName === filters.university) &&
        (filters.subject === "all-subjects" || record.subject === filters.subject) &&
        (!filters.students || record.students.toString() === filters.students) &&
        (filters.month === "all-months" || recordMonth === filters.month) &&
        dateMatch
      );
    });
  }, [records, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      university: "all-universities",
      subject: "all-subjects",
      students: "",
      month: "all-months",
      date: "",
    });
  };

  return (
    <div className="container py-8 mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cost Analysis History</h1>
          <p className="text-muted-foreground">
            View and filter your previous cost calculations
          </p>
        </div>
        <Button variant="destructive" onClick={clearHistory}>
          Clear History
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter your history by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* University Filter */}
            <div className="space-y-2">
              <Label htmlFor="universityFilter">University</Label>
              <Select
                value={filters.university}
                onValueChange={(value) => handleFilterChange("university", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-universities">All Universities</SelectItem>
                  {uniqueUniversities.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Filter */}
            <div className="space-y-2">
              <Label htmlFor="subjectFilter">Subject</Label>
              <Select
                value={filters.subject}
                onValueChange={(value) => handleFilterChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-subjects">All Subjects</SelectItem>
                  {uniqueSubjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Students Filter */}
            <div className="space-y-2">
              <Label htmlFor="studentsFilter">Students</Label>
              <Input
                id="studentsFilter"
                type="number"
                placeholder="Any number"
                value={filters.students}
                onChange={(e) => handleFilterChange("students", e.target.value)}
              />
            </div>

            {/* Month Filter */}
            <div className="space-y-2">
              <Label htmlFor="monthFilter">Month</Label>
              <Select
                value={filters.month}
                onValueChange={(value) => handleFilterChange("month", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-months">All Months</SelectItem>
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <Label htmlFor="dateFilter">Date</Label>
              <Input
                id="dateFilter"
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>
            {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                    <TableHead>Instance</TableHead>
                    <TableHead className="text-right">Cost/Hour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.timestamp), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{record.universityName}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell className="text-right">{record.students}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.recommendedInstance}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${record.estimatedCost.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-24 text-center text-muted-foreground">
              <p>No records found matching your filters.</p>
              {records.length > 0 && (
                <p className="mt-2">Try adjusting your filters or <Button variant="link" onClick={resetFilters}>reset them</Button></p>
              )}
              {records.length === 0 && (
                <p className="mt-2">Go to the Cost Analysis page to perform calculations.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
