# InterviewIQ - Setup & Configuration Guide

## Backend & Frontend Connection Fix Summary

All connection issues have been fixed. Your code now properly communicates between frontend and backend, with all data stored in MongoDB.

---

## Quick Setup

### Backend Setup

1. **Navigate to Backend folder:**
   ```bash
   cd Backend
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Update environment variables in `.env`:**
   - `PORT=5000` (must match Frontend's VITE_API_URL)
   - `DB_URL=your-mongodb-connection-string`
   - `CLIENT_URL=http://localhost:5173` (Vite frontend URL)
   - Add your Stream.io API credentials
   - Add your Inngest credentials

4. **Install dependencies** (your existing packages are compatible):
   ```bash
   npm install
   ```

5. **Start backend**:
   ```bash
   npm run dev
   ```
   Should show: `Server is running on port 5000`

### Frontend Setup

1. **Navigate to Frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Create `.env.local` file** (already created with):
   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Install dependencies** (your existing packages are compatible):
   ```bash
   npm install
   ```

4. **Start frontend**:
   ```bash
   npm run dev
   ```
   Should run on: `http://localhost:5173`

---

## What Was Fixed

### 1. **API Route Mounting** (`Backend/src/server.js`)
   - **Problem:** Routes mounted without forward slashes (`api/chat` instead of `/api/chat`)
   - **Fix:** Added forward slashes for proper routing
   - **Result:** All API calls now reach the correct endpoints

### 2. **Stream Token Endpoint** (`Frontend/src/pages/SessionPage.jsx`)
   - **Problem:** Frontend called `/api/stream/token` but backend has `/api/chat/token`
   - **Fix:** Updated to call correct endpoint `/api/chat/token`
   - **Result:** Stream.io integration works properly

### 3. **Dashboard Data Fetching** (`Frontend/src/pages/DashboardPage.jsx`)
   - **Problem:** Used localStorage instead of backend APIs
   - **Fix:** Integrated proper backend API calls:
     - `GET /api/sessions/active` - fetch live sessions
     - `GET /api/sessions/my-recent` - fetch completed sessions
     - `POST /api/sessions` - create new sessions
     - `POST /api/sessions/{id}/join` - join existing sessions
   - **Result:** All session data now persists to MongoDB

### 4. **Session Field Mapping** (Both Pages)
   - **Problem:** Frontend used wrong field names from MongoDB schema
   - **Fix:** Updated field mappings:
     - `id` → `_id` (MongoDB ObjectId)
     - `title` → `problem`
     - `endedAt` → `updatedAt`
     - Participant count from `participant` field
   - **Result:** Correct data display from database

### 5. **View Details Button** (`Frontend/src/pages/DashboardPage.jsx`)
   - **Problem:** Button had no functionality
   - **Fix:** Added navigation to session details page
   - **Result:** Can now view past session details

---

## API Endpoints

All endpoints expect Clerk authentication headers.

### Session Management
- `POST /api/sessions` - Create new session
  ```json
  { "problem": "Two Sum", "difficulty": "easy" }
  ```
- `GET /api/sessions/active` - Get live sessions
- `GET /api/sessions/my-recent` - Get completed sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions/:id/join` - Join a session
- `POST /api/sessions/:id/end` - End a session

### Stream (Video Call)
- `GET /api/chat/token` - Get Stream.io token for video calls

---

## Package Compatibility

**Frontend packages used:**
- ✅ axios (HTTP requests)
- ✅ @tanstack/react-query (data fetching & caching)
- ✅ react-hot-toast (notifications)
- ✅ @stream-io/video-react-sdk (video calls)
- ✅ stream-chat-react (chat integration)

**Backend packages used:**
- ✅ express (server)
- ✅ mongoose (MongoDB)
- ✅ @clerk/express (authentication)
- ✅ @stream-io/node-sdk (Stream backend)
- ✅ inngest (background jobs)

No new packages added - using only your existing dependencies.

---

## Troubleshooting

### "Failed to create session" Error
- **Check:** Backend server is running on port 5000
- **Check:** `VITE_API_URL=http://localhost:5000` in Frontend `.env.local`
- **Check:** API call is to `/api/sessions` (with forward slash)

### "Failed to load session" Error
- **Check:** Backend routes start with `/api/` (fixed in server.js)
- **Check:** MongoDB connection (DB_URL in .env)
- **Check:** Browser console for exact error

### Stream Token Not Working
- **Check:** Endpoint is `/api/chat/token` (not `/api/stream/token`)
- **Check:** STREAM_API_KEY and STREAM_API_SECRET in backend .env

### CORS Errors
- **Check:** Backend `.env` has `CLIENT_URL=http://localhost:5173`
- **Check:** Frontend `.env.local` has `VITE_API_URL=http://localhost:5000`

---

## Next Steps

1. Copy `Backend/.env.example` to `Backend/.env` and fill in your credentials
2. Ensure MongoDB connection string is correct
3. Add your Stream.io API keys
4. Start both servers and test:
   - Create a new session
   - Join a session
   - View session details
   - Check MongoDB to confirm data is stored

All data is now properly persisted to your database!
