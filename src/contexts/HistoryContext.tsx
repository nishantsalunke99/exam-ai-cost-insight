
import React, { createContext, useContext, useEffect, useState } from "react";

export type CostAnalysisRecord = {
  id: string;
  universityName: string;
  subject: string;
  students: number;
  recommendedInstance: string;
  estimatedCost: number;
  timestamp: string;
};

interface HistoryContextType {
  records: CostAnalysisRecord[];
  addRecord: (record: Omit<CostAnalysisRecord, "id" | "timestamp">) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<CostAnalysisRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("costAnalysisHistory");
    if (savedHistory) {
      try {
        setRecords(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse history:", error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("costAnalysisHistory", JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<CostAnalysisRecord, "id" | "timestamp">) => {
    const newRecord: CostAnalysisRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    setRecords(prev => [newRecord, ...prev]);
  };

  const clearHistory = () => {
    setRecords([]);
  };

  return (
    <HistoryContext.Provider value={{ records, addRecord, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};
