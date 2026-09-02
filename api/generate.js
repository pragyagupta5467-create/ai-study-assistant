/**
 * Vercel Serverless Function: /api/generate
 * 
 * Supports both standalone Vercel serverless deployment and Render backend.
 * Handles POST requests, CORS headers, OPTIONS preflight, and calls LLM / mock service.
 */

// Helper to sanitize markdown backticks if returned by LLM
function extractJsonString(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

function getDifficultyInstructions(difficulty = 'medium') {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'Target Difficulty: EASY. Focus on basic foundational concepts, definitions, core terminology, and straightforward recall.';
    case 'hard':
      return 'Target Difficulty: HARD. Focus on advanced edge cases, in-depth architectural tradeoffs, tricky problem-solving scenarios, and deep critical reasoning.';
    case 'medium':
    default:
      return 'Target Difficulty: MEDIUM. Focus on conceptual understanding, practical real-world application, and standard problem-solving scenarios.';
  }
}

async function generateWithGemini(content, mode, difficulty = 'medium', weakTopics = null, apiKey = '') {
  const modelName = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  const difficultyText = getDifficultyInstructions(difficulty);

  let focusInstruction = '';
  if (Array.isArray(weakTopics) && weakTopics.length > 0) {
    focusInstruction = `IMPORTANT: This is a targeted practice quiz. Focus questions ONLY on these weak topics: ${weakTopics.join(', ')}.`;
  }

  const systemInstruction = mode === 'flashcards'
    ? `You are an expert AI study assistant. Convert the user's input notes or topic into an array of high-yield flashcards.
${difficultyText}

Output MUST strictly be valid raw JSON matching this schema:
{
  "type": "flashcards",
  "title": "A concise title for the study topic",
  "difficulty": "${difficulty}",
  "cards": [
    {
      "id": 1,
      "front": "Clear question, concept, or prompt matching ${difficulty} difficulty",
      "back": "Accurate, concise explanation or definition"
    }
  ]
}
Create between 5 and 10 flashcards. Return JSON only, with no surrounding commentary or markdown code blocks.`
    : `You are an expert AI study assistant. Convert the user's input notes or topic into a multiple-choice quiz.
${difficultyText}
${focusInstruction}

Output MUST strictly be valid raw JSON matching this schema:
{
  "type": "quiz",
  "title": "A concise title for the study topic",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text matching ${difficulty} level",
      "topic": "Specific subtopic/concept name (e.g. Recursion, State Management, Time Complexity, API Design)",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}
IMPORTANT RULES:
1. 'correctAnswer' MUST be the integer zero-based index (0, 1, 2, or 3) of the correct option in the options array.
2. Every question MUST include a concise, specific 'topic' name (2-4 words) indicating the sub-concept tested.
3. Provide 4 distinct options per question. Create 4 to 8 questions. Return JSON only, with no surrounding commentary or markdown code blocks.`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemInstruction}\n\nSTUDY CONTENT / TOPIC:\n${content}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Gemini API error (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('LLM returned an empty response.');
  }

  return extractJsonString(rawText);
}

async function generateWithOpenAI(content, mode, difficulty = 'medium', weakTopics = null, apiKey = '') {
  const url = 'https://api.openai.com/v1/chat/completions';
  const difficultyText = getDifficultyInstructions(difficulty);

  let focusInstruction = '';
  if (Array.isArray(weakTopics) && weakTopics.length > 0) {
    focusInstruction = `Focus questions ONLY on these weak topics: ${weakTopics.join(', ')}.`;
  }

  const systemMessage = mode === 'flashcards'
    ? `You are an expert AI study assistant. Convert the user's input into structured flashcards. ${difficultyText} Output strictly valid JSON conforming to:
{
  "type": "flashcards",
  "title": "Topic title",
  "difficulty": "${difficulty}",
  "cards": [
    { "id": 1, "front": "Question/Concept", "back": "Explanation/Answer" }
  ]
}`
    : `You are an expert AI study assistant. Convert the user's input into a multiple-choice quiz. ${difficultyText} ${focusInstruction} Output strictly valid JSON conforming to:
{
  "type": "quiz",
  "title": "Topic title",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "topic": "Specific subtopic or concept name",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Short explanation"
    }
  ]
}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-1106',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: content }
      ],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `OpenAI API error (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('LLM returned an empty response.');
  }

  return extractJsonString(rawText);
}

function generateDynamicMock(content, mode, difficulty = 'medium', weakTopics = null) {
  const trimmed = content.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const topicName = words.slice(0, 4).join(' ') || 'Core Subject';
  const diffLabel = difficulty.toUpperCase();

  if (mode === 'flashcards') {
    return JSON.stringify({
      type: 'flashcards',
      title: `${topicName} (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`,
      difficulty,
      cards: [
        {
          id: 1,
          front: difficulty === 'easy'
            ? `What is the fundamental definition of ${topicName}?`
            : difficulty === 'hard'
            ? `What are the critical architectural tradeoffs and concurrency edge cases in ${topicName}?`
            : `How is ${topicName} applied in real-world application architectures?`,
          back: difficulty === 'easy'
            ? `It is the foundational core component of ${trimmed.slice(0, 100)}.`
            : difficulty === 'hard'
            ? `Involves race conditions, cache invalidation bottlenecks, and strict synchronization primitives.`
            : `Enables modular design, separation of concerns, and clean decoupling across components.`
        },
        {
          id: 2,
          front: difficulty === 'easy'
            ? 'What is the primary benefit of modular structure?'
            : difficulty === 'hard'
            ? 'How does memory management and garbage collection impact performance under high load?'
            : 'What are the main performance optimization strategies for this pattern?',
          back: difficulty === 'easy'
            ? 'It makes code easier to read, test, and maintain.'
            : difficulty === 'hard'
            ? 'Retaining references causes memory leaks; heap allocation thrashing leads to GC latency spikes.'
            : 'Using memoization, lazy loading, debouncing, and optimized data structures.'
        },
        {
          id: 3,
          front: 'What common pitfalls or edge cases should be monitored?',
          back: 'State desynchronization, improper boundary validation, unhandled exceptions, and unoptimized resource usage.'
        },
        {
          id: 4,
          front: 'How is state consistency maintained across asynchronous operations?',
          back: 'By utilizing immutable state patterns, monotonic timestamps, and abortable cancellation controllers.'
        },
        {
          id: 5,
          front: 'What is the recommended best practice for production validation?',
          back: 'Maintain strict schema boundaries, sanitize all untrusted AI outputs, and provide graceful fallback states.'
        }
      ]
    });
  }

  const targetTopics = Array.isArray(weakTopics) && weakTopics.length > 0
    ? weakTopics
    : ['Core Architecture', 'State Management', 'Async Control Flow', 'Error Handling'];

  return JSON.stringify({
    type: 'quiz',
    title: weakTopics ? `Weak Topics Practice (${diffLabel})` : `${topicName} (${diffLabel} Quiz)`,
    difficulty,
    questions: [
      {
        id: 1,
        question: difficulty === 'easy'
          ? `What is the primary purpose of ${targetTopics[0] || 'Core Architecture'}?`
          : difficulty === 'hard'
          ? `In ${targetTopics[0] || 'Core Architecture'}, how are distributed race conditions resolved without global locking?`
          : `Which principle best describes clean ${targetTopics[0] || 'Core Architecture'}?`,
        topic: targetTopics[0] || 'Core Architecture',
        options: [
          'Enforcing modularity and single responsibility',
          'Eliminating all asynchronous operations',
          'Storing state globally without encapsulation',
          'Ignoring error boundaries and edge validation'
        ],
        correctAnswer: 0,
        explanation: 'Enforcing modularity and single responsibility ensures clean architecture, maintainability, and testability.'
      },
      {
        id: 2,
        question: difficulty === 'easy'
          ? `Why do we validate data in ${targetTopics[1] || 'State Management'}?`
          : difficulty === 'hard'
          ? `Under heavy concurrency in ${targetTopics[1] || 'State Management'}, what prevents stale closures from corrupting state?`
          : `Why is strict structured output validation critical in ${targetTopics[1] || 'State Management'}?`,
        topic: targetTopics[1] || 'State Management',
        options: [
          'LLM and external outputs can be non-deterministic or missing required fields',
          'It slows down client-side rendering intentionally',
          'It eliminates the need for modern JavaScript frameworks',
          'It replaces the need for backend servers entirely'
        ],
        correctAnswer: 0,
        explanation: 'Validating against strict schemas prevents runtime exceptions and keeps component state predictable.'
      },
      {
        id: 3,
        question: `How does AbortController prevent race conditions in ${targetTopics[2] || targetTopics[0]}?`,
        topic: targetTopics[2] || targetTopics[0] || 'Async Control Flow',
        options: [
          'It compresses network payloads automatically',
          'It cancels pending HTTP requests so outdated responses do not overwrite newer state',
          'It converts JSON into binary streams',
          'It restarts the web server on every fetch'
        ],
        correctAnswer: 1,
        explanation: 'AbortController allows active HTTP requests to be aborted when a new action occurs, preventing stale state bugs.'
      },
      {
        id: 4,
        question: `What is the primary learning benefit of targeted practice in ${targetTopics[3] || targetTopics[1]}?`,
        topic: targetTopics[3] || targetTopics[1] || 'Active Recall',
        options: [
          'It forces the user to start the entire quiz from question 1',
          'It isolates knowledge gaps and promotes active recall on weak concepts',
          'It deletes the user study history',
          'It changes the question language randomly'
        ],
        correctAnswer: 1,
        explanation: 'Targeted practice focuses specifically on identified weak areas, maximizing knowledge retention.'
      }
    ]
  });
}

export default async function handler(req, res) {
  // Set Universal CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Request-Id, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      endpoint: '/api/generate',
      service: 'StudyAI Serverless Backend',
      timestamp: new Date().toISOString()
    });
  }

  // Only POST is allowed for generation
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: `HTTP Method ${req.method} is not allowed. Please use POST.`
      }
    });
  }

  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;

  try {
    const { content, mode, difficulty = 'medium', weakTopics } = req.body || {};

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Content cannot be empty. Please provide notes or a topic to study.'
        }
      });
    }

    if (!mode || !['flashcards', 'quiz'].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MODE',
          message: 'Invalid study mode. Mode must be either "flashcards" or "quiz".'
        }
      });
    }

    const validDifficulty = ['easy', 'medium', 'hard'].includes(String(difficulty).toLowerCase())
      ? String(difficulty).toLowerCase()
      : 'medium';

    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const openAIKey = process.env.OPENAI_API_KEY?.trim();
    const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();

    let rawAiOutput = '';

    if (provider === 'gemini' && geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      rawAiOutput = await generateWithGemini(content.trim(), mode, validDifficulty, weakTopics, geminiKey);
    } else if (provider === 'openai' && openAIKey && openAIKey !== 'YOUR_OPENAI_API_KEY_HERE') {
      rawAiOutput = await generateWithOpenAI(content.trim(), mode, validDifficulty, weakTopics, openAIKey);
    } else if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      rawAiOutput = await generateWithGemini(content.trim(), mode, validDifficulty, weakTopics, geminiKey);
    } else if (openAIKey && openAIKey !== 'YOUR_OPENAI_API_KEY_HERE') {
      rawAiOutput = await generateWithOpenAI(content.trim(), mode, validDifficulty, weakTopics, openAIKey);
    } else {
      rawAiOutput = generateDynamicMock(content.trim(), mode, validDifficulty, weakTopics);
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawAiOutput);
    } catch (parseErr) {
      return res.status(502).json({
        success: false,
        error: {
          code: 'MALFORMED_AI_JSON',
          message: 'The AI model generated an invalid JSON response structure.'
        }
      });
    }

    if (typeof parsedData !== 'object' || parsedData === null) {
      return res.status(502).json({
        success: false,
        error: {
          code: 'INVALID_AI_SCHEMA',
          message: 'The AI returned non-object JSON data.'
        }
      });
    }

    if (!parsedData.difficulty) {
      parsedData.difficulty = validDifficulty;
    }

    return res.status(200).json({
      success: true,
      requestId,
      data: parsedData
    });
  } catch (error) {
    console.error(`[${requestId}] Generation error:`, error.message);
    return res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_FAILED',
        message: error.message || 'An unexpected error occurred during generation.'
      }
    });
  }
}
