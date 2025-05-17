import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useResumeContext } from '../context/ResumeContext';
import { extractTextFromFile } from '../services/fileService';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setResumeFile, 
    setResumeText, 
    jobDescription, 
    setJobDescription, 
    setIsAnalyzing 
  } = useResumeContext();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document.');
      return false;
    }
    
    // 10MB max size
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB.');
      return false;
    }
    
    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        handleFileSelection(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        handleFileSelection(file);
      }
    }
  };

  const handleFileSelection = async (file: File) => {
    setError('');
    setSelectedFile(file);
    setResumeFile(file);
    
    try {
      setLoading(true);
      const text = await extractTextFromFile(file);
      setResumeText(text);
    } catch (err) {
      setError('Error processing file. Please try another file.');
      setSelectedFile(null);
      setResumeFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please upload your resume.');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter the job description.');
      return;
    }
    
    setIsAnalyzing(true);
    navigate('/results');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-10">Match Your Resume to a Job</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <div className="card h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-900" />
              Upload Your Resume
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${loading ? 'opacity-70' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {loading ? (
                <div className="py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Processing your resume<span className="loading-dots"></span></p>
                </div>
              ) : selectedFile ? (
                <div className="py-8">
                  <div className="bg-green-100 text-green-700 p-2 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-gray-900 mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => {
                      setSelectedFile(null);
                      setResumeFile(null);
                    }}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your resume here or{' '}
                    <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">PDF or Word documents only (max 10MB)</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Job Description */}
          <div className="card h-full">
            <h2 className="text-xl font-semibold mb-4">Enter Job Description</h2>
            <p className="text-gray-600 mb-4">
              Paste the full job description to analyze how well your resume matches.
            </p>
            <textarea
              className="textarea h-64"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <button
            className="btn btn-primary px-8 py-3 text-lg"
            onClick={handleSubmit}
            disabled={loading || !selectedFile || !jobDescription.trim()}
          >
            Analyze Resume Match
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPage;