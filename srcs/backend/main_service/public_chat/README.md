# Chat Integration Guide

## Overview
The chat system is now integrated with the main application's authentication. Users do NOT need to login separately to the chat.

## How It Works

### 1. Main Application Authentication
When a user logs into the main application, store the JWT token in sessionStorage or localStorage:

```javascript
// After successful login in main app:
sessionStorage.setItem('authToken', accessToken);
// or
localStorage.setItem('authToken', accessToken);
```

### 2. Accessing the Chat
Users can access the chat in two ways:

#### Option A: Direct Link
```
http://localhost:3000/chat
```

The chat will automatically:
- Read the token from sessionStorage/localStorage
- Authenticate the user
- Connect to Socket.IO
- Load conversations

#### Option B: Embedded in iframe
```html
<!-- In your main app -->
<iframe src="http://localhost:3000/chat" width="100%" height="600"></iframe>
```

#### Option C: Pass Token via URL (if needed)
```
http://localhost:3000/chat?token=YOUR_JWT_TOKEN
```

### 3. API Endpoints Used

- `GET /api/auth/me` - Get current user info (requires auth token)
- `GET /api/conversations` - Get user's conversations (requires auth)
- `GET /api/messages/:conversationId` - Get messages (requires auth)
- `POST /api/messages` - Send message (requires auth)
- WebSocket connection for real-time updates (requires auth)

### 4. User Roles Supported

- **recruiter** (RH)
- **candidate**
- **admin**

## Testing

For development/testing, you can use the test endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/test-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "recruiter-123", "userRole": "recruiter"}'
```

This returns a token you can use for testing.

## Implementation Example

```javascript
// In your main application after login:
async function loginUser(credentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  
  // Store the token for chat to use
  sessionStorage.setItem('authToken', data.accessToken);
  
  // Now user can access chat without additional login
  window.location.href = '/chat';
}
```

## Security Notes

- The chat uses the same JWT authentication as the main application
- Tokens are verified on every API request
- Socket.IO connections are authenticated with the same token
- No separate login is needed - seamless user experience
