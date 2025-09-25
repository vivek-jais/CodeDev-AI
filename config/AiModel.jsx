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
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
  ],
  responseMimeType: "application/json",
};


export  const GenerateTopicsAIModel= model.startChat({
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

  export  const GenerateCourseAIModel= model.startChat({
    generationConfig,
    history: [
     
    ],
  });

  // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  // // TODO: Following code needs to be updated for client-side apps.
  // const candidates = result.response.candidates;
  // for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
  //   for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
  //     const part = candidates[candidate_index].content.parts[part_index];
  //     if(part.inlineData) {
  //       try {
  //         const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
  //         fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
  //         console.log(`Output written to: ${filename}`);
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   }
  // }
  // console.log(result.response.text());




  
 