# AI Study Assistant

AI Study Assistant (StudyAI) is a web application that turns raw study notes or topic prompts into interactive flashcards and quizzes. Instead of a chatbot interface, the backend asks an LLM for structured JSON, which the frontend validates and renders into study tools.

## Features

- User Authentication: Sign In and Create Account modal with 1-click Demo Login, password toggle, and student role selection
- Generate flashcards or quizzes from notes or topics
- Difficulty selection (Easy, Medium, Hard)
- Interactive flashcards with 3D flip animation, confidence ratings (Easy, Good, Hard), shuffle, and keyboard navigation
- Multiple-choice quiz with real-time answer checking, score calculation, and explanations
- Retest wrong answers to practice only the questions you missed
- Learning analysis that breaks down performance and groups topics into strong areas and areas needing improvement
- Practice weak topics button to generate a new quiz targeting only your weak concepts
- Mistakes Hub for reviewing and tracking historical question mistakes
- Progress & analytics dashboard with a 7-day study streak tracker and weekly activity charts
- Search command palette (Ctrl+K / Cmd+K)
- Loading and error states with retry options
- Mobile responsive layout with dark mode support

## Tech Stack

- Frontend: React 18, Vite, JavaScript, CSS
- Icons: Lucide React
- Backend: Node.js, Express, Cors, Dotenv
- AI API: Google Gemini API / OpenAI API

## How It Works

1. The user creates an account, signs in, or uses the pre-configured demo student profile.
2. The user pastes study notes or types a topic.
3. The user selects a study mode (Flashcards, Quiz, or Both) and a difficulty level (Easy, Medium, Hard).
4. The frontend sends the input to the Express backend.
5. The backend calls the LLM with a system prompt requiring strict JSON output.
6. The frontend validates the JSON structure and fields before rendering the interactive components.

## Project Setup

### 1. Install dependencies

Run this from the project root to install dependencies for the root, server, and client:

```bash
npm run install:all
```

### 2. Configure environment variables (Optional)

Create a `.env` file in the `server` directory (or edit `server/.env`):

```env
PORT=5000
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

If you do not provide an API key, the backend uses a dynamic mock generator so you can still test all application features locally without setup.

### 3. Run the application

To start both the client and server concurrently:

```bash
npm run dev
```

- Frontend runs at: http://localhost:3000
- Backend runs at: http://localhost:5000

## Environment Variables

The backend uses the following environment variables inside `server/.env`:

- PORT: The port the Express server listens on (default is 5000).
- LLM_PROVIDER: Set to "gemini" or "openai" depending on which provider you want to use.
- GEMINI_API_KEY: Your Google Gemini API key.
- OPENAI_API_KEY: Your OpenAI API key (if using OpenAI).

The frontend makes requests to the Express server, so API keys stay on the backend and are not exposed in client-side code.

## AI Usage

I used AI tools during development to help brainstorm component structure, write initial boilerplate, and debug CSS layouts. All generated code was reviewed, refactored, and tested to ensure proper state management, strict input/output validation, and easy maintainability so I can clearly explain every part in an interview.

## Error Handling

Handling unpredictable AI responses was a priority for this project:

- Malformed or non-JSON output is caught on both backend and frontend.
- A custom validation utility (validateAIResponse.js) checks for required fields, minimum options, valid correct-answer indices, and topic tags before rendering.
- Stale responses are prevented using AbortController and request tracking, so faster or newer requests are not overwritten by delayed ones.
- Network errors, timeouts, and empty responses display a clear error card with Retry and Edit Input options.

## Known Limitations

- Very large text inputs (long textbook chapters) need to be trimmed or chunked so they fit comfortably within single LLM prompt limits.
- The learning analysis grouping depends on the topic tags provided in the response; if an AI omits a topic, it falls back to a general concept category.
- Free tier AI API keys may occasionally hit rate limits during rapid testing.

## Time Spent

Approximately 6 hours
