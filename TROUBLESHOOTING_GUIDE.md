# InterviewIQ - Troubleshooting Guide

## Common Issues After Fixes

### Issue 1: "Failed to create session" Toast
**Symptoms:** Session creation fails when clicking "Create Room" button

**Possible Causes & Solutions:**

1. **API URL not configured**
   - Check `Frontend/src/lib/axios.js` has correct `VITE_API_URL`
   - Should be: `http://localhost:5000` (or your backend URL)
   - If using env file: Create `.env.local` with `VITE_API_URL=http://localhost:5000`

2. **Backend not running**
   - In Backend folder: Run `npm run dev`
   - Should see: "Server is running on port 5000"
   - Check no other app is using port 5000

3. **CORS issue**
   - Backend at `/Backend/src/server.js` has CORS configured
   - Make sure `CLIENT_URL` environment variable matches your frontend URL
   - Should be: `http://localhost:5173` for Vite dev server

4. **Missing environment variables on backend**
   - Create `.env` file in Backend folder with:
     ```
     DB_URL=mongodb://localhost:27017/interviewiq
     STREAM_API_KEY=your_key_here
     STREAM_API_SECRET=your_secret_here
     CLIENT_URL=http://localhost:5173
     PORT=5000
     ```

**Debug Steps:**
1. Open browser DevTools (F12) → Network tab
2. Click "Create Room"
3. Look for POST request to `/api/sessions`
4. Check response status and error message
5. Backend console should show error logs

---

### Issue 2: "Failed to load session" on SessionPage
**Symptoms:** SessionPage shows error instead of loading session

**Possible Causes:**

1. **Session ID doesn't exist in database**
   - Create a new session first
   - Copy the session ID from URL
   - Verify it exists in MongoDB

2. **axios instance not configured properly**
   - Ensure `/Frontend/src/lib/axios.js` imports axios correctly
   - `baseURL` should use `import.meta.env.VITE_API_URL`

3. **Backend session endpoint failing**
   - Check Backend console for errors
   - Verify MongoDB is connected: "MongoDB Connected: localhost"
   - Check `/api/sessions/{id}` endpoint exists in `/Backend/src/routes/sessionRoute.js`

**Debug Steps:**
1. Test backend directly: `curl http://localhost:5000/health`
2. Should return: `{"msg":"Success Health Check"}`
3. Check MongoDB connection: Look for "MongoDB Connected" in backend console
4. Use a tool like Postman to test `/api/sessions` endpoints

---

### Issue 3: Sessions not showing in Dashboard
**Symptoms:** No active or past sessions appear, even after creating them

**Possible Causes:**

1. **Data not persisting to MongoDB**
   - Check MongoDB is running: `mongod` or verify MongoDB Atlas connection
   - In backend console, look for "MongoDB Connected: ..." message
   - If not seen, DB_URL is incorrect or MongoDB is down

2. **API returning empty array**
   - New sessions don't appear in "My Recent" immediately
   - Only completed sessions appear there
   - Active sessions should appear in "Live Sessions" section
   - Try refreshing the page (F5)

3. **Wrong data structure from API**
   - Backend might be returning sessions but frontend expects different fields
   - Check browser console for errors
   - SessionData should have: `_id`, `problem`, `difficulty`, `host`, `participant`, `status`, `createdAt`

**Debug Steps:**
1. Open DevTools → Network tab
2. Go to Dashboard
3. Look for GET requests to `/api/sessions/active` and `/api/sessions/my-recent`
4. Check response bodies - should contain session data
5. If getting empty arrays `[]`, no sessions exist yet - create one first

---

### Issue 4: Video/Chat not loading in Session
**Symptoms:** Stream video/chat section shows spinner indefinitely

**Possible Causes:**

1. **Stream token not fetching**
   - Backend endpoint: `/api/chat/token` (note: not `/api/stream/token`)
   - Check browser Network tab for token request
   - Should return: `{token, userId, userName, userImage}`

2. **Missing Stream API credentials**
   - Backend needs `STREAM_API_KEY` and `STREAM_API_SECRET`
   - Frontend needs `VITE_STREAM_API_KEY`
   - Get these from your Stream dashboard

3. **Stream client initialization error**
   - Check backend console for "Error in getStreamToken"
   - Frontend console should show Stream client setup errors
   - Verify tokens are valid and not expired

**Debug Steps:**
1. Check backend console for token endpoint errors
2. Open frontend DevTools → Console
3. Look for Stream SDK initialization errors
4. Verify environment variables are set correctly
5. Test token endpoint: `curl http://localhost:5000/api/chat/token` (needs auth header)

---

### Issue 5: Join Session Returns "Session is full"
**Symptoms:** Can't join session even when it shows 1/2 participants

**Cause:** 
- Participant field logic - backend stores participant ObjectId when second user joins
- Frontend calculates: `participantCount = session.participant ? 2 : 1`
- If participant is null/undefined = 1 person, if populated = 2 people

**Solution:**
- This is working as designed for 1v1 sessions
- To allow more participants, modify Session schema and frontend logic

---

### Issue 6: Clerk Authentication Not Working
**Symptoms:** User info not available, can't create sessions

**Checks:**
1. Frontend has `@clerk/clerk-react` and `useUser()` hook
2. Verify Clerk publishable key is in environment
3. Check backend has `@clerk/express` middleware
4. Verify `protectRoute` middleware extracts user correctly from Clerk

**Debugging:**
```javascript
// In frontend components
const { user } = useUser();
console.log('User:', user); // Should show Clerk user object

// In backend
console.log('Clerk ID:', req.auth().userId); // Should show user ID
console.log('DB User:', req.user); // Should show MongoDB user object
```

---

## Database Verification

### Check MongoDB Connection
```bash
# If using local MongoDB
mongosh

# Check collections
use interviewiq
db.sessions.find()  # Should show created sessions
db.users.find()     # Should show registered users
```

### Verify Session Data
```javascript
// In MongoDB
db.sessions.findOne()

// Should return something like:
{
  "_id": ObjectId("..."),
  "problem": "Two Sum",
  "difficulty": "easy",
  "host": ObjectId("..."),
  "participant": null,  // or ObjectId if someone joined
  "status": "active",
  "callId": "session_1708..._xyz",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("..."),
  "__v": 0
}
```

---

## Network Requests Summary

### Dashboard Page Requests
```
GET  /api/sessions/active      → Returns active sessions
GET  /api/sessions/my-recent   → Returns completed sessions  
POST /api/sessions             → Create new session
POST /api/sessions/{id}/join   → Join a session
```

### Session Page Requests
```
GET  /api/sessions/{id}        → Get session details
GET  /api/chat/token           → Get Stream token
POST /api/sessions/{id}/end    → End session (host only)
```

---

## Important Notes

⚠️ **Keep these in mind:**

1. **Session IDs** - Backend uses MongoDB `_id` (ObjectId), always use `session._id` not `session.id`

2. **Difficulty field** - Stored in lowercase in database ("easy", "medium", "hard")

3. **Participant count** - For 1v1 sessions: presence of `session.participant` field = 2 people, absence = 1 person

4. **Status field** - Sessions are "active" by default, only host can end them (changes to "completed")

5. **Timestamps** - Use `createdAt` for session creation time, `updatedAt` for last modified time

6. **Stream integration** - Requires valid API keys from Stream dashboard, tokens are generated on-demand

---

## Quick Start Verification

Run this checklist after deploying fixes:

```
Backend:
☐ npm run dev works without errors
☐ "Server is running on port 5000" logged
☐ "MongoDB Connected" logged
☐ GET /health returns success

Frontend: 
☐ npm run dev works without errors
☐ Can see dashboard page
☐ Can open Create Session modal
☐ Can select a problem

Full Flow:
☐ Create new session → redirects to session page
☐ Session appears in "Live Sessions" section
☐ Join button works (with second account)
☐ Video loads (may timeout if Stream not configured)
☐ View Details on past sessions works
```

---

## Getting Help

If issues persist:

1. **Check logs first**
   - Backend: `npm run dev` output
   - Frontend: DevTools Console (F12)
   - Browser Network tab (F12 → Network)

2. **Verify configuration**
   - All `.env` variables set correctly
   - No typos in API URLs
   - API port matches (default 5000)
   - Frontend port matches (default 5173)

3. **Test endpoints directly**
   - Use Postman or cURL
   - Test each endpoint individually
   - Verify response format matches expected schema

4. **Database verification**
   - Data persists after refresh
   - MongoDB collections exist
   - Documents have correct structure
