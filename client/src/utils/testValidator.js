import { validateAIResponse, ERROR_CODES } from './validateAIResponse.js';

console.log('🧪 Running AI Output Validation Test Suite (with Difficulty & Topic Support)...\n');

let passed = 0;
let total = 0;

function assert(description, condition) {
  total++;
  if (condition) {
    console.log(`✅ [PASS] ${description}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${description}`);
  }
}

// 1. Empty / null response
const test1 = validateAIResponse(null);
assert('Handles null input', !test1.isValid && test1.error.code === ERROR_CODES.EMPTY_RESPONSE);

// 2. Malformed JSON string
const test2 = validateAIResponse('{ type: "flashcards", badJson... ');
assert('Handles malformed JSON string', !test2.isValid && test2.error.code === ERROR_CODES.INVALID_JSON_TYPE);

// 3. Wrong JSON structure (missing type / cards)
const test3 = validateAIResponse({ foo: 'bar' });
assert('Handles missing type and unknown structure', !test3.isValid && test3.error.code === ERROR_CODES.UNKNOWN_MODE);

// 4. Missing required card fields
const test4 = validateAIResponse({
  type: 'flashcards',
  title: 'Test',
  cards: [{ id: 1, front: 'Only front without back' }]
});
assert('Handles missing card back explanation', !test4.isValid && test4.error.code === ERROR_CODES.INVALID_CARD_ITEM);

// 5. Invalid quiz options count (< 2)
const test5 = validateAIResponse({
  type: 'quiz',
  title: 'Test Quiz',
  questions: [
    {
      id: 1,
      question: 'What is 2+2?',
      options: ['4'],
      correctAnswer: 0
    }
  ]
});
assert('Handles quiz with < 2 options', !test5.isValid && test5.error.code === ERROR_CODES.INVALID_OPTIONS_ARRAY);

// 6. Invalid correctAnswer index (out of bounds)
const test6 = validateAIResponse({
  type: 'quiz',
  title: 'Test Quiz',
  questions: [
    {
      id: 1,
      question: 'What is 2+2?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 5
    }
  ]
});
assert('Handles out-of-bounds correctAnswer index', !test6.isValid && test6.error.code === ERROR_CODES.INVALID_CORRECT_ANSWER_INDEX);

// 7. Valid Flashcards structure with markdown code fence wrapper and difficulty
const test7 = validateAIResponse('```json\n{"type":"flashcards","title":"Photosynthesis","difficulty":"hard","cards":[{"id":1,"front":"What is chlorophyll?","back":"Green pigment responsible for light absorption."}]}\n```');
assert('Handles markdown wrapped valid Flashcards JSON with difficulty', test7.isValid && test7.data.cards.length === 1 && test7.data.difficulty === 'hard');

// 8. Valid Quiz structure with topic tags
const test8 = validateAIResponse({
  type: 'quiz',
  title: 'Data Structures',
  difficulty: 'hard',
  questions: [
    {
      id: 1,
      question: 'Which tree structure guarantees O(log n) worst-case search time?',
      topic: 'Binary Search Trees',
      options: ['Red-Black Tree', 'Unbalanced BST', 'Linear Array', 'Queue'],
      correctAnswer: 0,
      explanation: 'Red-Black Trees are self-balancing BSTs guaranteeing O(log n) search.'
    },
    {
      id: 2,
      question: 'What is the space complexity of bottom-up Dynamic Programming for Fibonacci?',
      topic: 'Dynamic Programming',
      options: ['O(1)', 'O(n^2)', 'O(n!)', 'O(2^n)'],
      correctAnswer: 0,
      explanation: 'By storing only the previous two states, it runs in O(1) auxiliary space.'
    }
  ]
});
assert('Validates and normalizes valid Quiz JSON with topic tags', test8.isValid && test8.data.questions[0].topic === 'Binary Search Trees' && test8.data.questions[1].topic === 'Dynamic Programming');

// 9. Graceful fallback for missing topic tag on quiz question
const test9 = validateAIResponse({
  type: 'quiz',
  title: 'Fallback Test',
  questions: [
    {
      id: 1,
      question: 'What is HTTP?',
      options: ['Protocol', 'Language', 'Database', 'IDE'],
      correctAnswer: 0,
      explanation: 'Hypertext Transfer Protocol'
    }
  ]
});
assert('Provides graceful fallback if topic tag is missing', test9.isValid && test9.data.questions[0].topic === 'Core Concepts');

console.log(`\n🎉 Results: ${passed} / ${total} tests passed.`);

if (passed !== total) {
  process.exit(1);
}
