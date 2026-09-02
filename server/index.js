import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateStudyMaterial } from './llmService.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Study Assistant Backend'
  });
});

/**
 * Main Generation Endpoint: POST /api/generate
 * Body: { content: string, mode: 'flashcards' | 'quiz', difficulty?: 'easy' | 'medium' | 'hard', weakTopics?: string[] }
 */
app.post('/api/generate', async (req, res) => {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
  console.log(`[${requestId}] Incoming study generation request.`);

  try {
    const { content, mode, difficulty = 'medium', weakTopics } = req.body;

    // 1. Validate Input Content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Content cannot be empty. Please provide notes or a topic to study.'
        }
      });
    }

    // 2. Validate Selected Mode
    if (!mode || !['flashcards', 'quiz'].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MODE',
          message: 'Invalid study mode. Mode must be either "flashcards" or "quiz".'
        }
      });
    }

    // 3. Validate Difficulty (defaults to medium)
    const validDifficulty = ['easy', 'medium', 'hard'].includes(String(difficulty).toLowerCase())
      ? String(difficulty).toLowerCase()
      : 'medium';

    // 4. Call LLM Service
    console.log(`[${requestId}] Generating [${mode}] (Difficulty: ${validDifficulty}, WeakTopics: ${Array.isArray(weakTopics) ? weakTopics.join(',') : 'none'})`);
    const rawAiOutput = await generateStudyMaterial(content.trim(), mode, validDifficulty, weakTopics);

    // 5. Server-Side Pre-Validation: Ensure rawAiOutput is valid JSON
    let parsedData;
    try {
      parsedData = JSON.parse(rawAiOutput);
    } catch (parseErr) {
      console.error(`[${requestId}] Failed to parse LLM output as JSON:`, parseErr.message);
      return res.status(502).json({
        success: false,
        error: {
          code: 'MALFORMED_AI_JSON',
          message: 'The AI model generated an invalid JSON response structure.',
          rawOutput: process.env.NODE_ENV === 'development' ? rawAiOutput : undefined
        }
      });
    }

    // 6. Structural check
    if (typeof parsedData !== 'object' || parsedData === null) {
      return res.status(502).json({
        success: false,
        error: {
          code: 'INVALID_AI_SCHEMA',
          message: 'The AI returned non-object JSON data.'
        }
      });
    }

    // Ensure difficulty field is preserved in output payload
    if (!parsedData.difficulty) {
      parsedData.difficulty = validDifficulty;
    }

    // 7. Return verified payload
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
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🚀 AI Study Assistant Server running on http://localhost:${PORT}`);
  console.log(`   LLM Provider: ${process.env.LLM_PROVIDER || 'gemini'}`);
  console.log(`   API Key configured: ${Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY)}`);
  console.log(`===========================================`);
});
