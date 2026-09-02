/**
 * AI Response Validator
 * 
 * Production-grade schema validator that verifies structured AI responses
 * before they can be rendered by React components.
 * 
 * Validates:
 * 1. Malformed / non-object JSON
 * 2. Empty or null responses
 * 3. Wrong JSON structure or missing type
 * 4. Missing required fields in Flashcards (id, front, back)
 * 5. Missing required fields in Quiz (id, question, topic, options, correctAnswer, explanation)
 * 6. Invalid quiz options (not an array, < 2 options, non-string items)
 * 7. Invalid correctAnswer index (out of range, not integer)
 * 8. Graceful normalization of topic tags
 */

export const ERROR_CODES = {
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  INVALID_JSON_TYPE: 'INVALID_JSON_TYPE',
  UNKNOWN_MODE: 'UNKNOWN_MODE',
  MISSING_TITLE: 'MISSING_TITLE',
  INVALID_CARDS_ARRAY: 'INVALID_CARDS_ARRAY',
  INVALID_CARD_ITEM: 'INVALID_CARD_ITEM',
  INVALID_QUESTIONS_ARRAY: 'INVALID_QUESTIONS_ARRAY',
  INVALID_QUESTION_ITEM: 'INVALID_QUESTION_ITEM',
  INVALID_OPTIONS_ARRAY: 'INVALID_OPTIONS_ARRAY',
  INVALID_CORRECT_ANSWER_INDEX: 'INVALID_CORRECT_ANSWER_INDEX',
  EMPTY_CONTENT: 'EMPTY_CONTENT'
};

/**
 * Validates and normalizes flashcards payload
 */
function validateFlashcards(payload) {
  if (!Array.isArray(payload.cards) || payload.cards.length === 0) {
    return {
      isValid: false,
      error: {
        code: ERROR_CODES.INVALID_CARDS_ARRAY,
        message: 'The AI output does not contain any flashcards or the "cards" field is missing.'
      }
    };
  }

  const normalizedCards = [];

  for (let i = 0; i < payload.cards.length; i++) {
    const card = payload.cards[i];
    if (!card || typeof card !== 'object') {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_CARD_ITEM,
          message: `Flashcard at index ${i + 1} is not a valid object.`
        }
      };
    }

    const front = typeof card.front === 'string' ? card.front.trim() : '';
    const back = typeof card.back === 'string' ? card.back.trim() : '';

    if (!front || !back) {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_CARD_ITEM,
          message: `Flashcard #${i + 1} is missing a front question or back explanation.`
        }
      };
    }

    normalizedCards.push({
      id: card.id !== undefined ? card.id : i + 1,
      front,
      back
    });
  }

  return {
    isValid: true,
    data: {
      type: 'flashcards',
      title: typeof payload.title === 'string' && payload.title.trim() ? payload.title.trim() : 'Study Flashcards',
      difficulty: payload.difficulty || 'medium',
      cards: normalizedCards
    },
    error: null
  };
}

/**
 * Validates and normalizes quiz payload with topic categorization
 */
function validateQuiz(payload) {
  if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
    return {
      isValid: false,
      error: {
        code: ERROR_CODES.INVALID_QUESTIONS_ARRAY,
        message: 'The AI output does not contain any questions or the "questions" field is missing.'
      }
    };
  }

  const normalizedQuestions = [];

  for (let i = 0; i < payload.questions.length; i++) {
    const q = payload.questions[i];
    if (!q || typeof q !== 'object') {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_QUESTION_ITEM,
          message: `Question at index ${i + 1} is not a valid object.`
        }
      };
    }

    const questionText = typeof q.question === 'string' ? q.question.trim() : '';
    if (!questionText) {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_QUESTION_ITEM,
          message: `Question #${i + 1} has empty or missing question text.`
        }
      };
    }

    // Gracefully normalize topic field
    const topicText = typeof q.topic === 'string' && q.topic.trim()
      ? q.topic.trim()
      : 'Core Concepts';

    // Validate options array
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_OPTIONS_ARRAY,
          message: `Question #${i + 1} must have at least 2 answer options.`
        }
      };
    }

    const cleanedOptions = q.options.map(opt => (typeof opt === 'string' ? opt.trim() : String(opt || '').trim()));
    if (cleanedOptions.some(opt => opt.length === 0)) {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_OPTIONS_ARRAY,
          message: `Question #${i + 1} contains empty answer choices.`
        }
      };
    }

    // Validate correctAnswer index
    const correctIdx = Number(q.correctAnswer);
    if (!Number.isInteger(correctIdx) || correctIdx < 0 || correctIdx >= cleanedOptions.length) {
      return {
        isValid: false,
        error: {
          code: ERROR_CODES.INVALID_CORRECT_ANSWER_INDEX,
          message: `Question #${i + 1} has an invalid "correctAnswer" index (${q.correctAnswer}). Must be between 0 and ${cleanedOptions.length - 1}.`
        }
      };
    }

    const explanation = typeof q.explanation === 'string' && q.explanation.trim()
      ? q.explanation.trim()
      : 'Correct answer based on the study material.';

    normalizedQuestions.push({
      id: q.id !== undefined ? q.id : i + 1,
      question: questionText,
      topic: topicText,
      options: cleanedOptions,
      correctAnswer: correctIdx,
      explanation
    });
  }

  return {
    isValid: true,
    data: {
      type: 'quiz',
      title: typeof payload.title === 'string' && payload.title.trim() ? payload.title.trim() : 'Mastery Quiz',
      difficulty: payload.difficulty || 'medium',
      questions: normalizedQuestions
    },
    error: null
  };
}

/**
 * Primary Validator function
 * @param {any} rawInput - Can be parsed object or raw JSON string
 * @param {string} expectedMode - 'flashcards' | 'quiz' (optional)
 * @returns {{ isValid: boolean, data: object|null, error: object|null }}
 */
export function validateAIResponse(rawInput, expectedMode = null) {
  // 1. Check for empty/null response
  if (rawInput === null || rawInput === undefined || rawInput === '') {
    return {
      isValid: false,
      data: null,
      error: {
        code: ERROR_CODES.EMPTY_RESPONSE,
        message: 'Received an empty response from the AI model.'
      }
    };
  }

  // 2. Parse if raw string is provided
  let parsed = rawInput;
  if (typeof rawInput === 'string') {
    try {
      let cleaned = rawInput.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      parsed = JSON.parse(cleaned);
    } catch (err) {
      return {
        isValid: false,
        data: null,
        error: {
          code: ERROR_CODES.INVALID_JSON_TYPE,
          message: `AI generated malformed JSON: ${err.message}`
        }
      };
    }
  }

  // 3. Ensure top-level structure is an object
  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
    return {
      isValid: false,
      data: null,
      error: {
        code: ERROR_CODES.INVALID_JSON_TYPE,
        message: 'Expected a top-level JSON object from AI generation.'
      }
    };
  }

  // 4. Determine mode
  const detectedMode = parsed.type || expectedMode;
  if (!detectedMode) {
    return {
      isValid: false,
      data: null,
      error: {
        code: ERROR_CODES.UNKNOWN_MODE,
        message: 'Response is missing the required "type" field ("flashcards" or "quiz").'
      }
    };
  }

  // 5. Run mode-specific schema validator
  if (detectedMode === 'flashcards') {
    return validateFlashcards(parsed);
  } else if (detectedMode === 'quiz') {
    return validateQuiz(parsed);
  } else {
    return {
      isValid: false,
      data: null,
      error: {
        code: ERROR_CODES.UNKNOWN_MODE,
        message: `Unknown study mode "${detectedMode}". Expected "flashcards" or "quiz".`
      }
    };
  }
}
