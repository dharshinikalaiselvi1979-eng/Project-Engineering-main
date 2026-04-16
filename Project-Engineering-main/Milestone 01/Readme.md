# AI Chatbot

## What I Built
I built a full-stack AI chatbot application using a Node.js Express backend and a vanilla JavaScript frontend. The chatbot allows users to have real-time conversations with an AI model while maintaining conversation context.

---

## API and Model Used
**API:** OpenRouter API  
**Model:** openai/gpt-4o-mini  

The backend sends user messages to OpenRouter, which returns AI-generated responses that are displayed in the frontend chat interface.

---

## Why Backend is Used Instead of Frontend
The API call is handled in the backend because exposing the API key in frontend JavaScript would allow anyone to view it using browser developer tools. This could lead to unauthorized usage and abuse of the API quota. The backend acts as a secure proxy that keeps the API key hidden from the client.

---

## Fallback Provider
If OpenRouter API credits run out, I would switch to Google Gemini API.

### Required Changes:
1. Change API base URL to Google Generative Language API endpoint  
2. Change model name to `gemini-1.5-flash`  
3. Replace OpenRouter API key with Gemini API key in environment variables  

---

## Features
- Real-time chat interface
- AI responses using OpenRouter
- Conversation memory (context handling)
- Backend-secured API calls
- Simple responsive UI

---

## Project Structure

---

## Live Deployment

**Frontend:** https://your-frontend-url.netlify.app  
**Backend:** https://your-backend-url.onrender.com

---

## How to Run Locally

### Backend
```bash
cd backend
npm install
node server.js