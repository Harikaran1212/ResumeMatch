import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_REACT_API_KEY;

// Initialize the API
let genAI: GoogleGenerativeAI;
try {
  genAI = new GoogleGenerativeAI(API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

interface ResumeAnalysisResult {
  matchScore: number;
  suggestions: string[];
  improvedResume: string;
}

/**
 * Analyzes a resume against a job description
 * @param resumeText The text content of the resume
 * @param jobDescription The job description text
 * @returns Analysis results including match score, suggestions, and improved resume
 */
export const analyzeResume = async (
  resumeText: string,
  jobDescription: string
): Promise<ResumeAnalysisResult> => {
  const apiKey =  API_KEY;
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent";
  const prompt = `
      I'm going to provide you with a resume and a job description. Please analyze how well the resume matches the job description and provide:
      
      1. A match score percentage (0-100) based on how well the resume aligns with the job requirements
      2. A list of 3-5 specific suggestions to improve the resume for this job
      3. An improved version of the resume tailored specifically for this job
      
      Format your response exactly as JSON with the following structure:
      {
        "matchScore": number,
        "suggestions": string[],
        "improvedResume": string
      }
      
      Resume:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
    `;
  
  try {
    // Make API request using fetch
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
   

// Step 2: Parse it into an object
    try {
      const parsedResponse =   responseText.replace(/^```json\s*|\s*```$/g, '');
      console.log('Parsed API response:', parsedResponse);
      return JSON.parse(parsedResponse);
    } catch (jsonError) {
      console.error('Failed to parse AI response as JSON:', jsonError);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Failed to fetch from Gemini API:', error);
    throw new Error('Failed to communicate with Gemini API');
  }
};

/**
 * Generates mock analysis result for demo purposes when API fails
 */
const getMockAnalysisResult = (resumeText: string, jobDescription: string): ResumeAnalysisResult => {
  const mockScore = Math.min(85, 40 + (resumeText.length / 1000) * 10 + (Math.random() * 20));
  
  const jobTitleMatch = jobDescription.match(/(?:job title|position|role|title)[:]*\s*([a-zA-Z\s]+)/i);
  const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : 'Software Developer';

  return {
    matchScore: Math.round(mockScore),
    suggestions: [
      `Add more specific experience related to ${jobTitle} role requirements`,
      'Quantify your achievements with metrics and numbers',
      'Include relevant keywords from the job description',
      'Highlight specific technical skills mentioned in the job posting',
      'Reorganize sections to emphasize most relevant experience first'
    ],
    improvedResume: `IMPROVED RESUME FOR ${jobTitle.toUpperCase()} POSITION\n\n${resumeText}\n\n[Note: This is a mock improved resume. This fallback is shown when the AI service encounters an error.]`
  };
};