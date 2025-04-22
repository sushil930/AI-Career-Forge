
// Mock function to simulate resume parsing
export const parseResumeText = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // In a real implementation, we would use a library to extract text from PDF/DOCX
    setTimeout(() => {
      resolve(
        "John Doe\nSoftware Engineer\n\nEXPERIENCE\nABC Tech (2018-2022)\n- Developed web applications using React\n- Collaborated with cross-functional teams\n\nEDUCATION\nComputer Science, University of Technology (2014-2018)\n\nSKILLS\nJavaScript, React, Node.js, Git"
      );
    }, 1500);
  });
};

// Mock function to simulate AI analysis
export const analyzeResume = (resumeText: string): Promise<ResumeAnalysis> => {
  return new Promise((resolve) => {
    // In a real implementation, this would be a call to Gemini API
    setTimeout(() => {
      resolve({
        overallScore: 78,
        categoryScores: {
          formatting: 85,
          content: 75,
          keywords: 65,
          impact: 80
        },
        suggestions: [
          "Add more quantifiable achievements to demonstrate impact",
          "Include relevant keywords from the job descriptions you're targeting",
          "Improve the structure with more consistent formatting",
          "Add a professional summary section"
        ],
        strengths: [
          "Good technical skills section",
          "Clear chronological work history",
          "Education section is well-formatted"
        ]
      });
    }, 2000);
  });
};

// Mock function to simulate job matching
export const matchResumeToJob = (resumeText: string, jobDescription: string): Promise<JobMatch> => {
  return new Promise((resolve) => {
    // In a real implementation, this would be a call to Gemini API
    setTimeout(() => {
      resolve({
        matchScore: 72,
        missingKeywords: ["Docker", "CI/CD", "AWS", "Agile methodology"],
        suggestions: [
          "Add experience with cloud platforms like AWS if you have any",
          "Mention your experience with Agile/Scrum methodologies",
          "Highlight any DevOps experience including CI/CD pipelines",
          "Include Docker and containerization experience"
        ]
      });
    }, 2000);
  });
};

// Mock function to simulate AI resume generation
export const generateResume = (userInfo: UserResumeInfo): Promise<string> => {
  return new Promise((resolve) => {
    // In a real implementation, this would be a call to Gemini API
    setTimeout(() => {
      resolve(`
# ${userInfo.personalInfo.name}
${userInfo.personalInfo.email} | ${userInfo.personalInfo.phone}

## Professional Summary
Dedicated ${userInfo.targetRole} with ${userInfo.experience[0].years} years of experience developing scalable applications. Passionate about creating efficient, maintainable code and delivering exceptional user experiences.

## Experience
### ${userInfo.experience[0].company}
**${userInfo.experience[0].role}** | ${userInfo.experience[0].startDate} - ${userInfo.experience[0].endDate || 'Present'}
- Led development of key features for company's main product
- Collaborated with design team to implement responsive UI
- Improved application performance by 30%

## Education
### ${userInfo.education[0].institution}
**${userInfo.education[0].degree}** | ${userInfo.education[0].graduationYear}

## Skills
${userInfo.skills.join(', ')}
      `);
    }, 3000);
  });
};

// Types
export interface ResumeAnalysis {
  overallScore: number;
  categoryScores: {
    formatting: number;
    content: number;
    keywords: number;
    impact: number;
  };
  suggestions: string[];
  strengths: string[];
}

export interface JobMatch {
  matchScore: number;
  missingKeywords: string[];
  suggestions: string[];
}

export interface UserResumeInfo {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  targetRole: string;
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    years: number;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    graduationYear: string;
  }[];
  skills: string[];
}
