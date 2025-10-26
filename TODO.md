# TODO: Implement AI User Stories Generation Feature

## Steps to Complete

- [x] Install `groq-sdk` dependency in server/package.json
- [x] Add `userStories` field (JSON array of strings) to Project model in server/src/models/project.js
- [x] Create new route file server/src/routes/ai.js for POST /api/ai/generate-user-stories endpoint
- [x] Update server/src/index.js to include the new AI routes
- [x] Implement endpoint logic: authenticate user, extract projectId and projectDescription, fetch project, generate stories using GROQ API, update project with userStories, optionally create tasks from stories, return user stories
- [x] Ensure GROQ_API_KEY is set in .env file
- [x] Test the endpoint using Postman or similar tool
- [x] Verify that stories are stored in the database and tasks are created if applicable
