import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Lightbulb, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeContext } from '../context/ResumeContext';
import { analyzeResume } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    resumeText, 
    jobDescription, 
    matchScore, 
    setMatchScore, 
    suggestions, 
    setSuggestions,
    improvedResumeText, 
    setImprovedResumeText,
    isAnalyzing, 
    setIsAnalyzing 
  } = useResumeContext();

  useEffect(() => {
    // Redirect if no resume text or job description
    if (!resumeText || !jobDescription) {
      navigate('/upload');
      return;
    }

    // Perform analysis if we're in analyzing state
    if (isAnalyzing) {
      const performAnalysis = async () => {
        try {
          const result = await analyzeResume(resumeText, jobDescription);
          setMatchScore(result.matchScore);
          setSuggestions(result.suggestions);
          setImprovedResumeText(result.improvedResume);
        } catch (error) {
          console.error('Analysis error:', error);
          // Handle error state
        } finally {
          setIsAnalyzing(false);
        }
      };

      performAnalysis();
    }
  }, [resumeText, jobDescription, isAnalyzing, navigate, setMatchScore, setSuggestions, setImprovedResumeText, setIsAnalyzing]);

  const getScoreColor = () => {
    if (!matchScore) return 'text-gray-700';
    if (matchScore >= 80) return 'text-green-600';
    if (matchScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDownload = () => {
    if (!improvedResumeText) return;
    
    const blob = new Blob([improvedResumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'improved-resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold mb-3">Analyzing Your Resume</h2>
          <p className="text-gray-600 text-lg mb-2">
            Our AI is comparing your resume with the job description<span className="loading-dots"></span>
          </p>
          <p className="text-gray-500">This may take a minute or two.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/upload')}
        className="flex items-center text-gray-600 hover:text-blue-900 mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Upload
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Your Resume Analysis</h1>
        
        {/* Match Score */}
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-blue-900 mr-2" />
            <h2 className="text-2xl font-semibold">Match Score</h2>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {matchScore !== null ? `${matchScore}%` : '--'}
            </div>
            
            <p className="text-gray-600 text-center mb-4">
              {matchScore !== null && matchScore >= 80 && 'Excellent match! Your resume aligns well with this job.'}
              {matchScore !== null && matchScore >= 60 && matchScore < 80 && 'Good match. With some improvements, your resume can be even better.'}
              {matchScore !== null && matchScore < 60 && 'Your resume needs significant improvements to match this job description.'}
            </p>
            
            <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  matchScore !== null && matchScore >= 80 ? 'bg-green-600' : 
                  matchScore !== null && matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                }`}
                style={{ width: `${matchScore || 0}%` }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Improvement Suggestions */}
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <Lightbulb className="h-6 w-6 text-blue-900 mr-2" />
            <h2 className="text-2xl font-semibold">Improvement Suggestions</h2>
          </div>
          
          {suggestions.length > 0 ? (
            <ul className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="bg-blue-100 text-blue-800 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-800">{suggestion}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">No suggestions available.</p>
          )}
        </motion.div>
        
        {/* Improved Resume */}
        <motion.div 
          className="card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Your Improved Resume</h2>
            
            <button 
              onClick={handleDownload}
              disabled={!improvedResumeText}
              className="btn btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md prose max-w-none whitespace-pre-wrap border border-gray-200 max-h-96 overflow-y-auto">
            {improvedResumeText ? (
              <ReactMarkdown>
              {improvedResumeText}
            </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">Improved resume not available.</p>
            )}
          </div>
        </motion.div>
        
        <div className="flex justify-center mt-10">
          <button 
            onClick={() => navigate('/upload')}
            className="btn btn-outline mr-4"
          >
            Try Another Resume
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={!improvedResumeText}
            className="btn btn-secondary"
          >
            Download Improved Resume
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;