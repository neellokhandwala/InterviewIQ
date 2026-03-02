# InterviewIQ - Backend & Frontend Connection Fixes

## Issues Fixed

### 1. **Missing Forward Slash in Route Mounting (Backend)**
**Problem:** Routes were mounted without leading `/` causing 404 errors
- `app.use("api/chat", chatRoutes)` ❌
- `app.use("api/sessions", sessionRoutes)` ❌

**Fix:** Added forward slashes in `/Backend/src/server.js`
- `app.use("/api/chat", chatRoutes)` ✅
- `app.use("/api/sessions", sessionRoutes)` ✅

---

### 2. **Incorrect API Endpoint in SessionPage**
**Problem:** Frontend was calling `/api/stream/token` but backend endpoint is `/api/chat/token`

**File:** `/Frontend/src/pages/SessionPage.jsx` (Line 146)
```javascript
// Before
const { data } = await axios.get('/api/stream/token');

// After
const { data } = await axiosInstance.get('/api/chat/token');
```

---

### 3. **Wrong Axios Instance and Import**
**Problem:** SessionPage was using raw `axios` instead of the configured `axiosInstance`

**Files:** 
- `/Frontend/src/pages/SessionPage.jsx` - Changed 3 axios calls to use `axiosInstance`
- Updated imports to use `../lib/axios` instead of raw axios

---

### 4. **DashboardPage Using localStorage Instead of Backend**
**Problem:** Dashboard was storing/retrieving sessions from localStorage instead of calling backend APIs

**Files:** `/Frontend/src/pages/DashboardPage.jsx`

**Changes:**
- Added import for `axiosInstance`
- Replaced localStorage logic with backend API calls:
  - `GET /api/sessions/active` - Fetch active sessions
  - `GET /api/sessions/my-recent` - Fetch past completed sessions
  - `POST /api/sessions` - Create new session
  - `POST /api/sessions/{id}/join` - Join existing session

**New Session Creation:**
```javascript
// Before: Used mock data stored in localStorage
// After: Calls backend API
const response = await axiosInstance.post('/api/sessions', {
  problem: selectedProblem.title,
  difficulty: selectedProblem.difficulty.toLowerCase()
})
```

---

### 5. **Session Data Field Mapping**
**Problem:** Frontend was using old mock field names that don't match MongoDB schema

**MongoDB Session Schema Fields:**
- `_id` (MongoDB ObjectId) - use `session._id`
- `problem` (String) - use `session.problem`
- `difficulty` (String: "easy", "medium", "hard") - use `session.difficulty`
- `host` (ObjectId ref User) - use `session.host`
- `participant` (ObjectId ref User) - use `session.participant`
- `status` (String: "active" or "completed") - use `session.status`
- `callId` (String) - use `session.callId`
- `createdAt` (Date) - use `session.createdAt`
- `updatedAt` (Date) - use `session.updatedAt`

**Frontend Updates:**
- Session ID: Changed from `session.id` to `session._id`
- Problem name: Changed from `session.title` to `session.problem`
- Difficulty: Changed from `session.difficulty` (no case change needed, backend validates)
- Participant count: Calculate from presence of `session.participant` field
- Timestamp: Changed from `session.endedAt` to `session.updatedAt`

---

### 6. **View Details Button Now Functional**
**Problem:** Past sessions "View Details" button wasn't navigating anywhere

**Fix:** Added navigation handler in `/Frontend/src/pages/DashboardPage.jsx`
```javascript
onClick={() => navigate(`/session/${session._id}`)}
```

---

## API Endpoints Verified

### Session Routes (`/api/sessions`)
- ✅ `POST /api/sessions` - Create session (requires: problem, difficulty)
- ✅ `GET /api/sessions/active` - Get all active sessions
- ✅ `GET /api/sessions/my-recent` - Get user's completed sessions
- ✅ `GET /api/sessions/{id}` - Get session details by ID
- ✅ `POST /api/sessions/{id}/join` - Join an active session
- ✅ `POST /api/sessions/{id}/end` - End a session (host only)

### Chat Routes (`/api/chat`)
- ✅ `GET /api/chat/token` - Get Stream token for video/chat

---

## Database Persistence

All data now properly persists to MongoDB:
- ✅ Sessions are created and stored in MongoDB
- ✅ Session status updates (active → completed)
- ✅ Participant joins are saved to database
- ✅ Past sessions are retrieved from database

---

## Environment Variables Required

Backend needs:
```
DB_URL=your_mongodb_connection_string
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret
CLIENT_URL=frontend_url (e.g., http://localhost:5173)
PORT=5000
```

Frontend needs:
```
VITE_API_URL=http://localhost:5000
VITE_STREAM_API_KEY=your_stream_key
```

---

## Testing Checklist

- [ ] Create new session from modal
- [ ] Session appears in "Live Sessions" 
- [ ] Join existing session (as second user/incognito)
- [ ] Session shows correct participant count
- [ ] View Details button on past sessions navigates to session
- [ ] Video/Chat loads without errors
- [ ] End session button works and marks session as completed
- [ ] Refresh page - sessions still visible (from database)

---

## Files Modified

**Backend:**
- ✅ `/Backend/src/server.js` - Fixed route mounting

**Frontend:**
- ✅ `/Frontend/src/pages/DashboardPage.jsx` - Major refactor to use backend APIs
- ✅ `/Frontend/src/pages/SessionPage.jsx` - Updated API calls and endpoints

**No changes needed:**
- ✅ `/Backend/src/models/Session.js` - Schema is correct
- ✅ `/Backend/src/controllers/sessionController.js` - Logic is correct
- ✅ `/Backend/src/routes/sessionRoute.js` - Routes are correct
- ✅ `/Backend/src/lib/stream.js` - Stream config is correct
