# Sandbox server

## Session middleware

Every request goes through Hono's middleware chain before it hits any oRPC procedure:

```text
Request
   │
   ▼
CORS middleware        ← allows your frontend origin, enables cookies
   │
   ▼
Session middleware     ← reads cookie, verifies HMAC signature,
   │                     creates new session if none exists,
   ▼                     sets c.set('session', { sessionId, displayName })
oRPC handler           ← createContext() pulls session from c.get('session')
   │
   ▼
procedure              ← context.session is verified, trusted, typed
```

The key point is that `sessionId` and `displayName` never come from the request body. The client has no say in what its session is. This prevents spoofing — you can't pretend to be someone else by sending a different sessionId.