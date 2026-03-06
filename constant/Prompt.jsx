import dedent from "dedent";

export default {
  IDEA: dedent`:As your are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study (Short)
    - Make sure it is releated to description
    - Output MUST be VALID JSON with structure: {"course_titles": ["title1", "title2", ...]}
    - Do not add any plain text before or after JSON
    - Response MUST start with { and end with }
    `,
  COURSE: dedent`: Create simple, concise courses about the learning topics.
    - Create 1-2 Courses ONLY (not more)
    - Each course MUST have: courseTitle, description (2 sentences), banner_image (pick randomly from /banner1.png to /banner6.png), category, chapters (4-5 chapters)
    - Each chapter MUST have: chapterName and content array with 2-3 items
    - Each content item MUST have: topic (short title), explain (2-3 lines max), example (brief example)
    - NO quizzes, NO flashcards, NO Q&A sections
    - NO code examples, keep it simple and readable
    - Keep explanations SHORT (2-3 lines each)
    - Categories: "Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity"
    - Output MUST be VALID, COMPLETE JSON with this exact structure:
    {"course": {"courses": [{"courseTitle": "Title", "description": "Desc", "banner_image": "/banner1.png", "category": "Tech & Coding", "chapters": [{"chapterName": "Ch", "content": [{"topic": "T", "explain": "E", "example": "Ex"}]}]}]}}
    - IMPORTANT: Response MUST start with { and MUST end with }
    - Do not add any plain text, markdown, or code blocks
    - Ensure JSON is COMPLETE (no truncation)
    `
};



