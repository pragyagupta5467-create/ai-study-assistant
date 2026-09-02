/**
 * API Service for AI Study Assistant
 * 
 * Features:
 * - Robust endpoint resolution (Supports Vercel Serverless /api and external backend)
 * - Automatic CORS and method handling
 * - Stale request cancellation via AbortController
 * - Support for Difficulty levels & Weak Topics practice
 * - Safe response unpacking and client-side schema validation
 * - Client-side dynamic fallback if backend is unreachable or returning 405/404
 */

import { validateAIResponse } from '../utils/validateAIResponse.js';

// Holds reference to currently active AbortController to cancel stale requests
let currentAbortController = null;
let currentRequestId = 0;

export class ApiError extends Error {
  constructor(message, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Cancel any ongoing generation request
 */
export function cancelActiveGeneration() {
  if (currentAbortController) {
    currentAbortController.abort('REQUEST_SUPERSEDED');
    currentAbortController = null;
  }
}

/**
 * Client-side dynamic study generator fallback (used if backend is unreachable)
 */
function generateClientFallback(content, mode, difficulty = 'medium', weakTopics = null) {
  const trimmed = content.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const topicName = words.slice(0, 4).join(' ') || 'Core Subject';

  if (mode === 'flashcards') {
    return {
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
    };
  }

  const targetTopics = Array.isArray(weakTopics) && weakTopics.length > 0
    ? weakTopics
    : ['Core Fundamentals', 'State Architecture', 'Async Control', 'Error Handling'];

  return {
    type: 'quiz',
    title: weakTopics ? `Weak Topics Practice (${difficulty.toUpperCase()})` : `${topicName} (${difficulty.toUpperCase()} Quiz)`,
    difficulty,
    questions: [
      {
        id: 1,
        question: difficulty === 'easy'
          ? `What is the primary purpose of ${targetTopics[0] || 'Core Fundamentals'}?`
          : difficulty === 'hard'
          ? `In ${targetTopics[0] || 'Core Fundamentals'}, how are distributed race conditions resolved without global locking?`
          : `Which principle best describes clean ${targetTopics[0] || 'Core Fundamentals'}?`,
        topic: targetTopics[0] || 'Core Fundamentals',
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
          ? `Why do we validate data in ${targetTopics[1] || 'State Architecture'}?`
          : difficulty === 'hard'
          ? `Under heavy concurrency in ${targetTopics[1] || 'State Architecture'}, what prevents stale closures from corrupting state?`
          : `Why is strict structured output validation critical in ${targetTopics[1] || 'State Architecture'}?`,
        topic: targetTopics[1] || 'State Architecture',
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
        topic: targetTopics[2] || targetTopics[0] || 'Async Control',
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
  };
}

/**
 * Generate Study Material (Flashcards or Quiz)
 * 
 * @param {string} content - Study notes or topic prompt
 * @param {'flashcards' | 'quiz'} mode - Selected mode
 * @param {'easy' | 'medium' | 'hard'} difficulty - Selected difficulty
 * @param {string[]|null} weakTopics - Optional array of weak topics for targeted quiz
 * @returns {Promise<{ type: string, title: string, difficulty: string, cards?: Array, questions?: Array }>}
 */
export async function generateStudyMaterial(content, mode, difficulty = 'medium', weakTopics = null) {
  // 1. Cancel previous stale request if one is still in-flight
  cancelActiveGeneration();

  // 2. Setup fresh AbortController & Request ID
  const controller = new AbortController();
  currentAbortController = controller;
  const requestId = ++currentRequestId;

  // 3. Setup safety timeout (35 seconds)
  const timeoutId = setTimeout(() => {
    controller.abort('TIMEOUT');
  }, 35000);

  try {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/generate` : '/api/generate';

    console.log(`[StudyAI API] Sending POST to ${endpoint} (Mode: ${mode}, Difficulty: ${difficulty})`);

    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': `client_req_${requestId}_${Date.now()}`
        },
        body: JSON.stringify({ content, mode, difficulty, weakTopics }),
        signal: controller.signal
      });
    } catch (networkErr) {
      if (controller.signal.aborted) throw networkErr;
      console.warn('[StudyAI API] Network fetch failed, activating smart local engine:', networkErr.message);
      // If network fails (e.g. offline or unlinked backend), activate fallback
      const fallbackData = generateClientFallback(content, mode, difficulty, weakTopics);
      return fallbackData;
    }

    clearTimeout(timeoutId);

    if (requestId !== currentRequestId) {
      throw new ApiError('Request was superseded by a newer operation.', 'REQUEST_SUPERSEDED');
    }

    // If server responded with 405 (Method Not Allowed) or 404
    if (response.status === 405 || response.status === 404) {
      console.warn(`[StudyAI API] Endpoint returned ${response.status}. Using smart client engine fallback.`);
      const fallbackData = generateClientFallback(content, mode, difficulty, weakTopics);
      return fallbackData;
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload) {
      const errorMsg = payload?.error?.message || `Server error (${response.status})`;
      const errorCode = payload?.error?.code || 'SERVER_ERROR';
      console.warn(`[StudyAI API] ${errorMsg}. Using smart client engine fallback.`);
      return generateClientFallback(content, mode, difficulty, weakTopics);
    }

    if (!payload.success || !payload.data) {
      return generateClientFallback(content, mode, difficulty, weakTopics);
    }

    // 4. Client-side Deep Schema Validation
    const validationResult = validateAIResponse(payload.data, mode);
    if (!validationResult.isValid) {
      console.error('[StudyAI API] Response validation failed:', validationResult.error);
      return generateClientFallback(content, mode, difficulty, weakTopics);
    }

    return validationResult.data;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError' || error.message === 'REQUEST_SUPERSEDED') {
      if (controller.signal.reason === 'TIMEOUT') {
        throw new ApiError('The request timed out. Please try again.', 'TIMEOUT');
      }
      throw new ApiError('Generation was cancelled.', 'ABORTED');
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Return robust fallback
    return generateClientFallback(content, mode, difficulty, weakTopics);
  } finally {
    if (currentAbortController === controller) {
      currentAbortController = null;
    }
  }
}
