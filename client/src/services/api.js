/**
 * API Service for AI Study Assistant
 * 
 * Features:
 * - Stale request cancellation via AbortController
 * - Support for Difficulty levels & Weak Topics practice
 * - Configurable request timeout (35 seconds)
 * - Safe response unpacking and client-side schema validation
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
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': `client_req_${requestId}_${Date.now()}`
      },
      body: JSON.stringify({ content, mode, difficulty, weakTopics }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // If a newer request was started in the meantime, ignore this response
    if (requestId !== currentRequestId) {
      throw new ApiError('Request was superseded by a newer operation.', 'REQUEST_SUPERSEDED');
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload) {
      const errorMsg = payload?.error?.message || `Server error (${response.status})`;
      const errorCode = payload?.error?.code || 'SERVER_ERROR';
      throw new ApiError(errorMsg, errorCode);
    }

    if (!payload.success || !payload.data) {
      throw new ApiError(
        payload?.error?.message || 'Server did not return study data.',
        payload?.error?.code || 'EMPTY_SERVER_RESPONSE'
      );
    }

    // 4. Client-side Deep Schema Validation
    const validationResult = validateAIResponse(payload.data, mode);
    if (!validationResult.isValid) {
      console.error('[Validation Failed]', validationResult.error);
      throw new ApiError(
        validationResult.error.message || 'AI response failed schema validation.',
        validationResult.error.code || 'VALIDATION_FAILED',
        validationResult.error
      );
    }

    return validationResult.data;

  } catch (error) {
    clearTimeout(timeoutId);

    // Handle Aborted / Cancelled requests gracefully
    if (error.name === 'AbortError' || error.message === 'REQUEST_SUPERSEDED') {
      if (controller.signal.reason === 'TIMEOUT') {
        throw new ApiError('The request timed out. The AI model took too long to respond. Please try again.', 'TIMEOUT');
      }
      throw new ApiError('Generation was cancelled.', 'ABORTED');
    }

    // If already an ApiError, rethrow
    if (error instanceof ApiError) {
      throw error;
    }

    // Catch Network / Connection failure
    if (!navigator.onLine) {
      throw new ApiError('No internet connection detected. Please check your network.', 'OFFLINE');
    }

    throw new ApiError(
      error.message || 'Unable to connect to the backend server. Please verify the server is running on port 5000.',
      'NETWORK_FAILURE'
    );
  } finally {
    if (currentAbortController === controller) {
      currentAbortController = null;
    }
  }
}
