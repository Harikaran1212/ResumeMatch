import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ResumeContextType {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  matchScore: number | null;
  setMatchScore: (score: number | null) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  improvedResumeText: string;
  setImprovedResumeText: (text: string) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  clearAll: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [improvedResumeText, setImprovedResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const clearAll = () => {
    setResumeFile(null);
    setResumeText('');
    setJobDescription('');
    setMatchScore(null);
    setSuggestions([]);
    setImprovedResumeText('');
    setIsAnalyzing(false);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeFile,
        setResumeFile,
        resumeText,
        setResumeText,
        jobDescription,
        setJobDescription,
        matchScore,
        setMatchScore,
        suggestions,
        setSuggestions,
        improvedResumeText,
        setImprovedResumeText,
        isAnalyzing,
        setIsAnalyzing,
        clearAll,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};