# Chat Microservice - Quick Start Guide (MariaDB)

## 🎯 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd chat-microservice
npm install
```

### Step 2: Setup MariaDB
```bash
# Using Docker (Easiest)
docker run -d --name mariadb \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=mypassword \
  -e MYSQL_DATABASE=chat_microservice \
  mariadb:latest
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=mypassword
DB_NAME=chat_microservice
```

### Step 4: Create Database Tables
```bash
npm run migrate
```

### Step 5: Start the Server
```bash
npm run dev
```

**Done! Service running at http://localhost:3000** 🎉

---

## 🧪 Test Your API

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Create a Chat
```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr" \
  -d '{"clientUserId": "client001"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Chat created successfully",
  "data": {
    "chat": {
      "id": 1,
      "hrUserId": "hr001",
      "clientUserId": "client001",
      "status": "active"
    },
    "created": true
  }
}
```

### 3. Send a Message
```bash
curl -X POST http://localhost:3000/api/chats/1/messages \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr" \
  -d '{"content": "Hello! Welcome to our platform."}'
```

### 4. Get Messages
```bash
curl http://localhost:3000/api/chats/1/messages \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr"
```

---

## 📊 Database Schema

**Chats Table:**
- `id` - Auto-increment primary key
- `hr_user_id` - HR user identifier
- `client_user_id` - Client user identifier
- `status` - active/archived/blocked
- `last_message_at` - Timestamp of last message
- `created_at`, `updated_at` - Timestamps

**Messages Table:**
- `id` - Auto-increment primary key
- `chat_id` - Foreign key to chats
- `sender_id` - Message sender identifier
- `sender_role` - hr or client
- `content` - Message text (max 5000 chars)
- `status` - sent/delivered/read
- `is_deleted` - Soft delete flag
- `created_at`, `updated_at` - Timestamps

---

## 🔑 Key Concepts

### Authentication Headers
Every request needs:
```
x-user-id: your_user_id
x-user-role: hr or client
```

### Business Rules
- ✅ Only HR can create chats
- ✅ One chat per HR-Client pair
- ✅ Both can send messages
- ✅ Only participants can access

---

## 📝 All API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/chats` | POST | HR | Create chat |
| `/api/chats` | GET | Yes | List chats |
| `/api/chats/:id` | GET | Yes | Get chat |
| `/api/chats/:id/archive` | PATCH | Yes | Archive chat |
| `/api/chats/:id/messages` | POST | Yes | Send message |
| `/api/chats/:id/messages` | GET | Yes | Get messages |
| `/api/chats/:id/messages/read` | PATCH | Yes | Mark read |
| `/api/chats/:id/messages/unread` | GET | Yes | Unread count |

---

## 🚨 Troubleshooting

**Database connection failed?**
```bash
# Check MariaDB is running
docker ps

# Verify credentials in .env
cat .env
```

**Tables not found?**
```bash
# Run migrations
npm run migrate
```

**Port already in use?**
```bash
# Change port in .env
PORT=3001
```

---

## 📚 Next Steps

1. ✅ Test all endpoints
2. ✅ Integrate with your frontend
3. ✅ Set up authentication service
4. ✅ Deploy to production

**For full documentation, see README.md** 📖
