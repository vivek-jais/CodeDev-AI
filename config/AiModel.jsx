const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
// const fs = require("node:fs");
// const mime = require("mime-types");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 0.3,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 30000,
  responseMimeType: "application/json",
};


export const GenerateTopicsAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Learn Python::As your are coaching teacher\n    - User want to learn about the topic\n    - Generate 5-7 Course title for study (Short)\n    - Make sure it is releated to description\n    - Output will be ARRAY of String in JSON FORMAT only\n    - Do not add any plain text in output."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n\"course_titles\": [\n  \"Python Basics for Beginners\",\n  \"Introduction to Python Programming\",\n  \"Python Fundamentals\",\n  \"Core Python Concepts\",\n  \"Getting Started with Python\",\n  \"Python for Beginners: A Practical Approach\",\n  \"Essential Python Skills\"\n]\n}\n```\n"},
      ],
    },
  ],
});

export const GenerateCourseAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Create courses about JavaScript and React"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "{\"course\":{\"courses\":[{\"name\":\"JavaScript Fundamentals\",\"description\":\"Learn core JavaScript concepts\",\"chapters\":[{\"name\":\"Variables and Data Types\",\"description\":\"Understanding variables, let, const, and primitive data types\"}]}]}}"},
      ],
    },
  ],
});

// Helper function to handle API calls with error handling and retry logic
export const sendAIMessage = async (chatModel, prompt, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!prompt || prompt.trim() === '') {
        throw new Error('Prompt cannot be empty');
      }
      
      if (!apiKey) {
        throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not configured. Please check your environment variables.');
      }

      console.log(`Sending message (Attempt ${attempt}/${maxRetries})...`);
      const result = await chatModel.sendMessage(prompt);
      
      if (!result || !result.response) {
        throw new Error('No response received from AI model');
      }

      const responseText = result.response.text();
      
      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      console.log('Message sent successfully');
      return result;
    } catch (error) {
      lastError = error;
      const errorMsg = error.message || JSON.stringify(error);
      console.error(`Attempt ${attempt}/${maxRetries} - Error in AI API call:`, errorMsg);
      
      // Check for quota exceeded errors (429 status)
      if (errorMsg.includes('429')) {
        const retryMatch = errorMsg.match(/Please retry in (\d+)/);
        const retryDelay = retryMatch ? parseInt(retryMatch[1]) * 1000 : Math.pow(2, attempt) * 1000;
        
        if (attempt < maxRetries) {
          console.log(`Rate limited. Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        } else {
          throw new Error(
            `API Quota Exceeded. The free tier limit has been reached. Please:\n` +
            `1. Wait 24 hours for the quota to reset, or\n` +
            `2. Upgrade your plan at https://console.cloud.google.com/billing`
          );
        }
      }
      
      // Check for fetch/network errors
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch')) {
        console.log('Network error detected. Retrying...');
        if (attempt < maxRetries) {
          const delayMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${delayMs / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
      }
      
      // For other errors, retry with exponential backoff
      if (attempt < maxRetries && !errorMsg.includes('cannot be empty') && !errorMsg.includes('not configured')) {
        const delayMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${delayMs / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else if (attempt === maxRetries) {
        // Last attempt failed
        break;
      }
    }
  }
  
  // All retries failed
  console.error('All retry attempts failed. Last error:', lastError.message);
  throw lastError;
};
