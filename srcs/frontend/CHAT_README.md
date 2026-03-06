# React Chat Implementation

## Overview

This is a complete React-based chat interface that replaces the previous vanilla HTML/JS chat embedded in an iframe. The new implementation follows React best practices with TypeScript, custom hooks, and proper state management.

## Architecture

### Directory Structure

```
src/
├── components/
│   ├── Chat.tsx                 # Main chat component
│   └── chat/
│       ├── ChatSidebar.tsx      # Conversations list sidebar
│       ├── ChatHeader.tsx       # Active conversation header
│       ├── ChatMessages.tsx     # Messages display area
│       ├── ChatInput.tsx        # Message input with file upload
│       └── index.ts             # Export barrel
├── hooks/
│   └── useChat.ts               # Custom hook for chat state & logic
├── services/
│   ├── chatApi.ts               # HTTP API client (axios)
│   └── chatSocket.ts            # Socket.IO client wrapper
└── types/
    └── chat.ts                  # TypeScript interfaces
```

## Features

### ✅ Implemented Features

1. **Real-time Messaging**
   - Socket.IO integration for instant message delivery
   - Typing indicators
   - Message read status

2. **User Presence**
   - Online/offline status indicators
   - Real-time status updates

3. **File Sharing**
   - Upload files up to 100MB
   - Image preview
   - Download attachments

4. **UI/UX**
   - Responsive design (mobile-first)
   - Dark mode support (follows parent app theme)
   - Auto-scroll to new messages
   - Search conversations
   - Empty states

5. **State Management**
   - Custom React hook (`useChat`)
   - Efficient updates with `setState` callbacks
   - Automatic message deduplication

## Components

### Chat (Main Component)

The root component that orchestrates all sub-components.

**Props:** None (uses `useChat` hook)

**Features:**
- Loading state
- Empty state when no conversation selected
- Mobile responsive layout
- Connection status indicator

### ChatSidebar

Displays list of conversations with search functionality.

**Props:**
```typescript
{
  user: User | null
  conversations: Conversation[]
  currentConversation: Conversation | null
  onlineUsers: Set<string>
  onSelectConversation: (id: string) => void
  getOtherParticipant: (conv: Conversation) => Participant
}
```

**Features:**
- Search/filter conversations
- Show unread message count
- Online status indicators
- Time formatting (e.g., "5m ago", "2h ago")

### ChatHeader

Shows active conversation details.

**Props:**
```typescript
{
  conversation: Conversation | null
  otherParticipant: Participant
  isOnline: boolean
  onBack?: () => void
  showBackButton?: boolean
}
```

### ChatMessages

Renders message list with auto-scroll.

**Props:**
```typescript
{
  messages: Message[]
  currentUser: User | null
  typingUsers: Map<string, TypingUser>
  messagesEndRef: RefObject<HTMLDivElement>
  isLoading?: boolean
}
```

**Features:**
- Message bubbles (sent/received styling)
- File attachments (images, files)
- Typing indicator animation
- Time stamps

### ChatInput

Message composition area with file upload.

**Props:**
```typescript
{
  onSendMessage: (content: string) => void
  onSendFile: (file: File) => void
  onStartTyping: () => void
  onStopTyping: () => void
  disabled?: boolean
}
```

**Features:**
- Auto-growing textarea
- File selection with preview
- Send on Enter (Shift+Enter for new line)
- Typing indicator triggers
- File size validation (100MB limit)

## Services

### ChatAPI (`chatApi.ts`)

HTTP client for REST API calls using axios.

**Key Methods:**
```typescript
getCurrentUser(): Promise<User>
getConversations(): Promise<Conversation[]>
getMessages(conversationId, limit?, before?): Promise<Message[]>
sendMessage(conversationId, content, type): Promise<Message>
uploadFile(conversationId, file): Promise<Message>
getRecruiter(): Promise<User>
markConversationAsRead(conversationId): Promise<void>
```

**Configuration:**
- Base URL: `VITE_API_URL` or `http://localhost:3000`
- Credentials: `withCredentials: true` (sends httpOnly cookies)
- Auto-redirect to `/login` on 401

### ChatSocket (`chatSocket.ts`)

Socket.IO client wrapper with event management.

**Key Methods:**
```typescript
connect(token?): void
disconnect(): void
on(event, handler): void
off(event, handler): void
sendMessage(conversationId, content): Promise<Message>
startTyping(conversationId): void
stopTyping(conversationId): void
joinConversation(conversationId): void
markAsRead(conversationId): void
```

**Socket Events:**
- `message:new` - New message received
- `message:updated` - Message edited
- `message:deleted` - Message deleted
- `message:read` - Message read status
- `typing:update` - User typing status
- `user:online` - User came online
- `user:offline` - User went offline
- `user:onlineUsers` - List of online users
- `conversation:new` - New conversation created

## Custom Hook: useChat

Central state management hook for chat functionality.

**Returns:**
```typescript
{
  // State
  user: User | null
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  onlineUsers: Set<string>
  typingUsers: Map<string, TypingUser>
  isConnected: boolean
  isLoading: boolean
  isLoadingMessages: boolean
  messagesEndRef: RefObject<HTMLDivElement>
  
  // Actions
  selectConversation: (id: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
  sendFile: (file: File) => Promise<void>
  startTyping: () => void
  stopTyping: () => void
  getOtherParticipant: (conv: Conversation) => Participant
}
```

**Key Features:**
- Automatic socket connection/disconnection
- Message deduplication
- Unread count management
- Auto-mark as read on conversation select
- Typing indicator debouncing

## Type Definitions

See [`types/chat.ts`](../types/chat.ts) for complete type definitions:
- `User`
- `Message`
- `Conversation`
- `Participant`
- `ChatState`
- `TypingUser`
- `SocketResponse<T>`

## Styling

The components use **Tailwind CSS** with custom dark mode classes:

- Light mode: Default Tailwind classes
- Dark mode: `dark:` prefix classes
- Dark mode colors follow the palette:
  - Background: `#0f172a`, `#1e293b`
  - Surface: `#1e293b`
  - Border: `#334155`
  - Text: `#f1f5f9`, `#e2e8f0`

## Usage

```tsx
import { Chat } from './components/Chat';

function App() {
  return (
    <div>
      <Chat />
    </div>
  );
}
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## Dependencies

Required npm packages (already in `package.json`):
- `react` - UI library
- `socket.io-client` - Real-time communication
- `axios` - HTTP client
- `lucide-react` - Icons
- `react-toastify` - Toast notifications
- `tailwindcss` - Styling

## Migration from Old Chat

The old chat was a vanilla HTML/JS application embedded in an iframe. The new React implementation provides:

### Advantages

1. **Better Integration**
   - No iframe isolation issues
   - Direct access to parent app state
   - Shared authentication (httpOnly cookies)

2. **Improved Performance**
   - Virtual DOM diffing
   - Component memoization
   - Efficient re-renders

3. **Better Developer Experience**
   - TypeScript type safety
   - Modern React patterns
   - Easier to maintain and extend

4. **Enhanced UX**
   - Smoother animations
   - Better mobile experience
   - Consistent with rest of app

### Breaking Changes

- Old URL-based theme sync removed (uses parent app theme directly)
- No standalone `/chat` route (embedded component only)
- API calls use same authentication as parent app

## Testing

To test the chat:

1. Start backend: `cd srcs && docker-compose up`
2. Start frontend: `cd srcs/frontend && npm run dev`
3. Navigate to `/chat` route
4. Login with test credentials
5. Test features:
   - Send text messages
   - Upload files/images
   - Check typing indicators
   - Verify online statuses
   - Test on mobile viewport

## Troubleshooting

### Messages not sending
- Check Socket.IO connection in browser DevTools
- Verify backend is running on port 3000
- Check browser console for errors

### Dark mode not working
- Ensure parent app toggles `dark` class on `<html>` element
- Check Tailwind config includes dark mode

### File upload fails
- Check file size (<100MB)
- Verify backend upload endpoint is accessible
- Check CORS settings if different origin

## Future Enhancements

Potential improvements:
- [ ] Message editing/deletion
- [ ] Emoji picker
- [ ] Voice messages
- [ ] Video calls
- [ ] Group chats
- [ ] Message reactions
- [ ] Message search
- [ ] Pagination for old messages
- [ ] Desktop notifications
- [ ] Message formatting (markdown)

## License

Part of ft_transcendance project.
