# Chat Microservice - Backend Only (MariaDB/MySQL)

A production-ready backend microservice for managing HR-Client chat communications in a recruitment platform using **MariaDB/MySQL** database.

## 📋 Overview

This microservice handles real-time messaging between HR recruiters and job/internship seekers. It operates as an independent service exposing REST APIs for integration with frontend applications.

### Key Features

- ✅ HR-Client private messaging
- ✅ Subscription-based chat access control
- ✅ RESTful API design
- ✅ **MariaDB/MySQL database**
- ✅ Message history & pagination
- ✅ Read receipts
- ✅ Clean architecture (MVC pattern)
- ✅ Production-ready error handling
- ✅ Input validation
- ✅ Scalable microservice design

## 🏗️ Architecture

```
chat-microservice/
├── src/
│   ├── config/
│   │   ├── database.js       # MariaDB connection pool
│   │   └── migrations.js     # Database schema setup
│   ├── models/
│   │   ├── Chat.js           # Chat model
│   │   └── Message.js        # Message model
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── messageController.js
│   ├── services/
│   │   ├── chatService.js
│   │   └── messageService.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── chatRoutes.js
│   │   └── messageRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── validators/
│   │   └── index.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- **MariaDB 10.5+** or **MySQL 8.0+**
- npm or yarn

### Installation

**1. Clone or extract the project:**
```bash
cd chat-microservice
```

**2. Install dependencies:**
```bash
npm install
```

**3. Setup MariaDB/MySQL Database:**

**Option A: Using Docker**
```bash
docker run -d \
  --name mariadb \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=chat_microservice \
  mariadb:latest
```

**Option B: Local Installation**
```bash
# Install MariaDB (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install mariadb-server

# Start service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Secure installation
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE chat_microservice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'chatuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON chat_microservice.* TO 'chatuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**4. Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=chatuser
DB_PASSWORD=your_password
DB_NAME=chat_microservice

ALLOWED_ORIGINS=http://localhost:3001
```

**5. Run database migrations:**
```bash
npm run migrate
```

This creates the required tables:
- `chats` - Stores chat conversations
- `messages` - Stores messages

**6. Start the service:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The service will start on `http://localhost:3000` 🎉

## 📡 API Usage

### Authentication

All requests require these headers:
```http
x-user-id: user123
x-user-role: hr
```

### Example: Create a Chat (HR only)

```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr123" \
  -H "x-user-role: hr" \
  -d '{"clientUserId": "client456"}'
```

### Example: Send a Message

```bash
curl -X POST http://localhost:3000/api/chats/1/messages \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr123" \
  -H "x-user-role: hr" \
  -d '{"content": "Hello! I would like to discuss the position."}'
```

### Example: Get Chat History

```bash
curl -X GET "http://localhost:3000/api/chats/1/messages?page=1&limit=50" \
  -H "x-user-id: hr123" \
  -H "x-user-role: hr"
```

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
  UNIQUE KEY unique_hr_client (hr_user_id, client_user_id),
  INDEX idx_hr_user (hr_user_id),
  INDEX idx_client_user (client_user_id),
  INDEX idx_status_updated (status, updated_at)
) ENGINE=InnoDB;
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  INDEX idx_chat_created (chat_id, created_at),
  INDEX idx_chat_status (chat_id, status),
  INDEX idx_sender (sender_id)
) ENGINE=InnoDB;
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable origin whitelist
- **Input Validation**: Express-validator for request validation
- **Access Control**: Role-based authorization
- **Chat Privacy**: Participant-only access enforcement
- **SQL Injection Prevention**: Parameterized queries with mysql2

## 📊 Business Rules

1. **HR Subscription Required**: HR must create/subscribe to a chat before messaging
2. **One Chat Per Pair**: Single chat instance per HR-Client combination
3. **Participant Access**: Only chat participants can send/view messages
4. **Role Restrictions**: Only HR can initiate new chats
5. **Message Limits**: Content capped at 5000 characters

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | MariaDB host | `localhost` |
| `DB_PORT` | MariaDB port | `3306` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | `chat_microservice` |
| `DB_CONNECTION_LIMIT` | Connection pool limit | `10` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3001` |

## 📈 Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side session storage
- **Connection Pooling**: Efficient database connections
- **Microservice Ready**: Independent deployment
- **Load Balancer Compatible**: Can run multiple instances

### Performance Optimization
- Indexed queries for chat and message retrieval
- Pagination support for large datasets
- Efficient composite indexes
- Connection pooling (configurable)

### Database Optimization
- **Indexes**: On all foreign keys and frequently queried columns
- **InnoDB Engine**: ACID compliance and row-level locking
- **UTF8MB4**: Full Unicode support including emojis
- **Cascading Deletes**: Automatic cleanup of related data

## 📝 API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check | No |
| `POST` | `/api/chats` | Create chat | HR only |
| `GET` | `/api/chats` | List user's chats | Yes |
| `GET` | `/api/chats/:id` | Get chat details | Yes |
| `PATCH` | `/api/chats/:id/archive` | Archive chat | Yes |
| `POST` | `/api/chats/:id/messages` | Send message | Yes |
| `GET` | `/api/chats/:id/messages` | Get messages | Yes |
| `PATCH` | `/api/chats/:id/messages/read` | Mark as read | Yes |
| `GET` | `/api/chats/:id/messages/unread` | Get unread count | Yes |

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Manual Testing with cURL

**Create Chat (as HR):**
```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr" \
  -d '{"clientUserId": "client001"}'
```

**List Chats:**
```bash
curl http://localhost:3000/api/chats \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr"
```

**Send Message:**
```bash
curl -X POST http://localhost:3000/api/chats/1/messages \
  -H "Content-Type: application/json" \
  -H "x-user-id: hr001" \
  -H "x-user-role: hr" \
  -d '{"content": "Hello!"}'
```

## 🚨 Error Handling

All API responses follow consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error description"
}
```

## 🛠️ Troubleshooting

### Database Connection Error
```bash
# Check MariaDB status
sudo systemctl status mariadb

# Verify credentials
mysql -u chatuser -p chat_microservice

# Check environment variables
cat .env
```

### Migration Issues
```bash
# Re-run migrations
npm run migrate

# Manually verify tables
mysql -u chatuser -p
USE chat_microservice;
SHOW TABLES;
DESCRIBE chats;
DESCRIBE messages;
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001
```

## 🔄 Database Migrations

The migration script (`src/config/migrations.js`) creates:
- Tables with proper schema
- Indexes for performance
- Foreign key constraints
- Default values

**Re-run migrations:**
```bash
npm run migrate
```

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",        // MariaDB/MySQL driver
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-validator": "^7.0.1"
}
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use parameterized queries to prevent SQL injection
3. Add validation for new endpoints
4. Update documentation
5. Test thoroughly before deployment

## 📄 License

ISC

## 👥 Support

For questions or issues:
- Verify database connection
- Check environment variables
- Ensure migrations are run
- Review error logs in console

---

**Built with Node.js, Express.js, and MariaDB/MySQL** 🚀
