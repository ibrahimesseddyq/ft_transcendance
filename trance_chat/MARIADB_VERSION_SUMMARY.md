# Chat Microservice - MariaDB Version

## 🎯 What's Delivered

Complete, production-ready backend microservice for HR-Client chat using **MariaDB/MySQL** database.

---

## ✅ Key Changes from MongoDB Version

### Database: MariaDB/MySQL
- ✅ **mysql2** library for database connection
- ✅ Connection pooling for performance
- ✅ SQL tables with proper indexes
- ✅ Foreign key constraints
- ✅ InnoDB engine with ACID compliance
- ✅ Auto-increment integer primary keys

### Tables Created
1. **chats** - Stores conversations
2. **messages** - Stores messages with foreign key to chats

### Migration System
- ✅ Automated table creation script
- ✅ Run with: `npm run migrate`
- ✅ Proper indexes for performance
- ✅ UTF8MB4 character set (emoji support)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup MariaDB (Docker)
docker run -d --name mariadb \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=mypassword \
  -e MYSQL_DATABASE=chat_microservice \
  mariadb:latest

# 3. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Create tables
npm run migrate

# 5. Start server
npm run dev
```

**Server running at http://localhost:3000** ✅

---

## 📁 Project Structure

```
chat-microservice/
├── src/
│   ├── config/
│   │   ├── database.js       # MariaDB connection pool
│   │   └── migrations.js     # Database schema setup
│   ├── models/
│   │   ├── Chat.js           # Chat model (SQL queries)
│   │   └── Message.js        # Message model (SQL queries)
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── routes/               # API routes
│   ├── middleware/           # Auth & error handling
│   ├── validators/           # Input validation
│   └── server.js             # Entry point
├── .env.example
├── package.json
├── README.md                 # Full documentation
└── QUICKSTART.md            # 5-minute setup guide
```

---

## 🗄️ Database Schema

### Chats Table
```sql
CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hr_user_id VARCHAR(100) NOT NULL,
  client_user_id VARCHAR(100) NOT NULL,
  status ENUM('active', 'archived', 'blocked') DEFAULT 'active',
  last_message_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_hr_client (hr_user_id, client_user_id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chat_id INT NOT NULL,
  sender_id VARCHAR(100) NOT NULL,
  sender_role ENUM('hr', 'client') NOT NULL,
  content TEXT NOT NULL,
  message_type ENUM('text', 'system') DEFAULT 'text',
  status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);
```

**Indexes:**
- Unique index on `(hr_user_id, client_user_id)`
- Index on `(chat_id, created_at)` for message retrieval
- Index on `(chat_id, status)` for unread counts

---

## 📡 API Endpoints (Same as MongoDB)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chats` | Create chat (HR only) |
| `GET` | `/api/chats` | List user's chats |
| `GET` | `/api/chats/:id` | Get chat details |
| `PATCH` | `/api/chats/:id/archive` | Archive chat |
| `POST` | `/api/chats/:id/messages` | Send message |
| `GET` | `/api/chats/:id/messages` | Get messages |
| `PATCH` | `/api/chats/:id/messages/read` | Mark as read |
| `GET` | `/api/chats/:id/messages/unread` | Unread count |

---

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# MariaDB Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_microservice
DB_CONNECTION_LIMIT=10

# CORS
ALLOWED_ORIGINS=http://localhost:3001
```

---

## 🧪 Test the API

### Create a Chat
```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr" \
  -d '{"clientUserId": "client001"}'
```

### Send a Message
```bash
curl -X POST http://localhost:3000/api/chats/1/messages \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr" \
  -d '{"content": "Hello from MariaDB!"}'
```

### Get Messages
```bash
curl http://localhost:3000/api/chats/1/messages \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr"
```

---

## 🔒 Security Features

- ✅ Parameterized SQL queries (prevents SQL injection)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ Role-based authorization
- ✅ Connection pooling

---

## 📊 Key Features

### Database Features
- **Connection Pooling**: Reuses connections for performance
- **Foreign Keys**: Ensures data integrity
- **Cascading Deletes**: Auto-cleanup of messages when chat deleted
- **Indexes**: Fast queries on large datasets
- **ACID Compliance**: InnoDB engine guarantees

### Application Features
- ✅ HR-Client private messaging
- ✅ Subscription-based access
- ✅ Message history with pagination
- ✅ Read receipts
- ✅ Unread counts
- ✅ Soft delete messages
- ✅ Archive chats

---

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",           // MariaDB/MySQL driver
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-validator": "^7.0.1"
}
```

---

## 🚨 Troubleshooting

### Database Connection Failed
```bash
# Check MariaDB is running
docker ps

# Test connection
mysql -h localhost -u root -p -e "SHOW DATABASES;"
```

### Tables Not Found
```bash
# Run migrations
npm run migrate

# Verify tables
mysql -u root -p chat_microservice -e "SHOW TABLES;"
```

### Authentication Errors
Ensure headers are set:
- `x-user-id`
- `x-user-role` (hr or client)

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| **README.md** | Complete documentation |
| **QUICKSTART.md** | 5-minute setup guide |
| **.env.example** | Environment template |
| **src/config/migrations.js** | Database schema |

---

## 🎯 What Makes This Production-Ready

1. ✅ **Robust Database**: MariaDB with proper schema
2. ✅ **Connection Pooling**: Efficient resource usage
3. ✅ **SQL Injection Prevention**: Parameterized queries
4. ✅ **Foreign Key Constraints**: Data integrity
5. ✅ **Indexes**: Fast query performance
6. ✅ **Error Handling**: Comprehensive error management
7. ✅ **Clean Architecture**: MVC pattern
8. ✅ **Scalable**: Stateless design
9. ✅ **Well Documented**: Clear setup instructions
10. ✅ **Easy Migration**: One command setup

---

## 🎓 Next Steps

1. ✅ Review documentation (README.md)
2. ✅ Setup MariaDB database
3. ✅ Run migrations
4. ✅ Test all endpoints
5. ✅ Integrate with frontend
6. ✅ Deploy to production

---

## 🏆 Advantages of MariaDB Version

### vs MongoDB Version
- ✅ **Relational integrity**: Foreign keys enforce relationships
- ✅ **ACID compliance**: Guaranteed data consistency
- ✅ **Mature ecosystem**: Decades of optimization
- ✅ **SQL queries**: Standard, well-understood
- ✅ **Better for complex joins**: If needed in future
- ✅ **Lower memory footprint**: Generally more efficient
- ✅ **Enterprise support**: MySQL/MariaDB widely adopted

---

**Built with Node.js, Express.js, and MariaDB** 🚀

Ready for production deployment!
