import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, BarChart, Download } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          Land Your Dream Job with AI-Enhanced Resumes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Upload your resume, paste a job description, and let our AI match and optimize your resume for better results.
        </p>
        <Link 
          to="/upload" 
          className="btn btn-primary text-lg px-8 py-3"
        >
          Get Started
        </Link>
      </motion.div>

      {/* How It Works */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <FileText className="h-10 w-10 text-blue-900" />,
              title: "Upload Resume",
              description: "Upload your existing resume in PDF or Word format."
            },
            {
              icon: <CheckCircle className="h-10 w-10 text-blue-900" />,
              title: "Add Job Description",
              description: "Paste the job description you're applying for."
            },
            {
              icon: <BarChart className="h-10 w-10 text-blue-900" />,
              title: "Get Match Score",
              description: "See how well your resume matches the job requirements."
            },
            {
              icon: <Download className="h-10 w-10 text-blue-900" />,
              title: "Download Optimized Resume",
              description: "Get an AI-enhanced resume tailored for the position."
            }
          ].map((step, index) => (
            <motion.div 
              key={index}
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use ResuMatch</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Higher Interview Chances",
              description: "Optimize your resume to beat ATS systems and impress hiring managers."
            },
            {
              title: "AI-Powered Insights",
              description: "Get intelligent suggestions based on your skills and job requirements."
            },
            {
              title: "Save Time",
              description: "Stop manually tailoring resumes for each application."
            }
          ].map((benefit, index) => (
            <motion.div 
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
            >
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div 
        className="text-center py-12 bg-blue-50 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Resume?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Get started now and increase your chances of landing that dream job.
        </p>
        <Link 
          to="/upload" 
          className="btn btn-primary text-lg px-8 py-3"
        >
          Analyze My Resume
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;