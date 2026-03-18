*This project has been created as part of the 42 curriculum by eaboudi, sessarhi, ibes-sed, ael-fagr, aachalla.*

# Hirefy

A modern, full-stack recruitment platform that connects candidates and recruiters through a seamless interface.

## Description

Hirefy is a web application designed to streamline the recruitment process. It offers job listings, application tracking, live chat, real-time notifications, quiz-based skill assessments, and a rich dashboard for recruiters.

Built with a **microservices architecture**, the platform consists of:

- **Main Service** — Handles users, jobs, applications, conversations, and profiles (Node.js / Express / Prisma)
- **Quiz Service** — Technical assessments via MCQ-based quizzes (Node.js / Express / Prisma)
- **AI Service** — Speech-to-text transcription (Whisper), text moderation, and image classification (FastAPI / Python)
- **Gateway** — API gateway for routing and security (Spring Boot / Java)
- **WAF** — Web Application Firewall layer
- **Frontend** — Single-page application (React / Vite / TypeScript / Tailwind CSS)

### Features

- User registration and authentication with JWT and two-factor authentication (2FA)
- Job posting and management for recruiters
- Application lifecycle tracking (submit, advance, reject, withdraw)
- Real-time chat between candidates and recruiters via Socket.IO
- Real-time notifications
- Quiz and MCQ-based technical assessments
- Speech-to-text input using AI (Whisper)
- Recruiter dashboard with analytics
- Avatar / profile management
- Role-based access control (candidate, recruiter, admin)

## Instructions

### Prerequisites

- Docker & Docker Compose
- Node.js & npm
- k3d (for Kubernetes deployment)
- Helm (for Kubernetes deployment)

### Development

```bash
make dev
```

This will:
1. Build and start the database containers (MariaDB)
2. Wait for databases to be healthy
3. Run database migrations and seed data
4. Start the main service, quiz service, and frontend concurrently

The frontend will be available at `http://localhost:5173` and the main service at `http://localhost:3000`.

### Production (Docker Compose)

```bash
make up
```

### Production (Kubernetes)

```bash
# Create the k3d cluster
make cluster-create

# Build images, load into cluster, and deploy all manifests
make kube
```

### Cleanup

```bash
# Stop dev services
make down-dev

# Stop production services
make down

# Full cleanup (remove volumes and images)
make fclean

# Tear down Kubernetes namespace
make kube-down
```

## Resources

### Documentation & References

- [React](https://react.dev/) — Frontend library
- [Vite](https://vitejs.dev/) — Frontend build tool
- [Express.js](https://expressjs.com/) — Backend framework
- [Prisma](https://www.prisma.io/) — ORM for Node.js
- [Socket.IO](https://socket.io/) — Real-time communication
- [FastAPI](https://fastapi.tiangolo.com/) — Python web framework for the AI service
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — Speech recognition model
- [Spring Boot](https://spring.io/projects/spring-boot) — API Gateway
- [HashiCorp Vault](https://www.vaultproject.io/) — Secrets management
- [Kubernetes](https://kubernetes.io/) — Container orchestration
- [Docker](https://docs.docker.com/) — Containerization

### AI Usage

AI tools were used in the following areas of this project:

- **Speech-to-text transcription** — The AI service uses the `faster-whisper` model (`small.en`) to transcribe audio recordings into text, enabling voice input in the chat interface.
- **Text moderation** — A transformer-based pipeline is used to moderate chat messages.
- **Image classification** — A ResNet50-based model is used for profile image classification.
- **Development assistance** — AI coding assistants were used to help with debugging, code exploration, and generating boilerplate code during development.

### Example: How AI Assisted During Development

Throughout the project, we used **Claude** (Anthropic) as a development assistant via Claude Code. Here is a concrete example of how it helped:

**Debugging the audio transcription flow** — When the speech-to-text feature was returning a `404 (POST http://localhost:5173/undefined/recognate)`, we used Claude to trace the full audio pipeline from the frontend `MediaRecorder` in `ChatInput.tsx`, through the axios client in `Api.ts`, to the FastAPI route in `speech_recognition_router.py`, and down to the Whisper model in `speech_recognate.py`. Claude identified that the environment variables `VITE_AI_SERVICE_URL` and `VITE_AI_API_URL` were missing from the `.env` file, causing both to resolve as `undefined` and the request to fall back to the Vite dev server origin instead of reaching the AI service.

Other tasks where AI assisted:
- **Codebase exploration** — Understanding the microservices architecture, tracing request flows across services, and mapping database relationships.
- **Boilerplate generation** — Scaffolding new components, API routes, and Prisma model definitions.
- **Documentation** — Generating this README with accurate details drawn from the actual codebase (Makefile targets, Prisma schemas, Docker Compose configs, Kubernetes manifests).
- **Code review** — Identifying potential issues such as missing error handling, incorrect environment variable references, and security considerations.

## Tech Stack

| Layer           | Technologies                                      |
|-----------------|----------------------------------------------------|
| Frontend        | React, Vite, TypeScript, Tailwind CSS              |
| Backend         | Node.js, Express, Prisma, MariaDB                  |
| AI Service      | Python, FastAPI, faster-whisper, TensorFlow         |
| Gateway         | Spring Boot (Java)                                  |
| Infrastructure  | Docker, Kubernetes (k3d), Nginx, HashiCorp Vault   |
| Real-time       | Socket.IO                                           |

## Team

| Login     | Name                  | Role              |
|-----------|-----------------------|-------------------|
| sessarhi  | Soufiane Essarhir     | PO (Project Manager) |
| eaboudi   | El Houssaine Aboudi   | Developer         |
| ibes-sed  | Ibrahim Esseddyq      | Architect         |
| ael-fagr  | Abdellatif El Fagrouch| Product Owner     |
| aachalla  | Abdelmajid Achallah   | Developer         |

## Modules

### Point Calculation

| #  | Module | Category | Type | Points | Status |
|----|--------|----------|------|--------|--------|
| 1  | Frontend + Backend Frameworks | Web | Major | 2 | Implemented |
| 2  | Real-time Features (WebSockets) | Web | Major | 2 | Implemented |
| 3  | User Interaction (Chat, Profiles) | Web | Major | 2 | Implemented |
| 4  | Public API | Web | Major | 2 | Implemented |
| 5  | ORM (Prisma) | Web | Minor | 1 | Implemented |
| 6  | Notification System | Web | Minor | 1 | Implemented |
| 7  | Custom Design System (10+ components) | Web | Minor | 1 | Implemented |
| 8  | Advanced Search with Filters, Sorting, Pagination | Web | Minor | 1 | Implemented |
| 9  | File Upload and Management | Web | Minor | 1 | Implemented |
| 10 | Standard User Management | User Management | Major | 2 | Implemented |
| 11 | Advanced Permissions (Roles) | User Management | Major | 2 | Implemented |
| 12 | OAuth 2.0 (Google) | User Management | Minor | 1 | Implemented |
| 13 | Two-Factor Authentication (2FA) | User Management | Minor | 1 | Implemented |
| 14 | Content Moderation AI | Artificial Intelligence | Minor | 1 | Implemented |
| 15 | Voice/Speech Integration | Artificial Intelligence | Minor | 1 | Implemented |
| 16 | Image Recognition and Tagging | Artificial Intelligence | Minor | 1 | Implemented |
| 17 | WAF/ModSecurity + HashiCorp Vault | Cybersecurity | Major | 2 | Implemented |
| 18 | Backend as Microservices | DevOps | Major | 2 | Implemented |
| 19 | Advanced Analytics Dashboard | Data and Analytics | Major | 2 | Implemented |
| 20 | Kubernetes Deployment & Orchestration (Custom) | Modules of Choice | Major | 2 | Implemented |
| 21 | Quiz/Assessment Engine (Custom) | Modules of Choice | Minor | 1 | Implemented |
| | | | **Total** | **31** | |

**Breakdown:** 10 Major modules (10 x 2 = 20 pts) + 11 Minor modules (11 x 1 = 11 pts) = **31 points** (14 required to pass, 5 bonus points max).

### Module Details

#### 1. Frontend + Backend Frameworks (Web — Major, 2 pts)

**Implementation:** React  with Vite, TypeScript, and Tailwind CSS for the frontend. Express  (main service) and Express  (quiz service) for the backend. FastAPI (Python) for the AI service. Spring Cloud Gateway (Java) for API routing.

**Justification:** Using a framework for both sides is the foundation of the project. React provides component-based UI composition with a mature ecosystem (React Query, Zustand, React Router). Express was chosen for its simplicity and large middleware ecosystem.

**Team:** ibes-sed , sessarhi, eaboudi , aachalla 

---

#### 2. Real-time Features via WebSockets (Web — Major, 2 pts)

**Implementation:** Socket.IO server in the main service handles:
- JWT-based socket authentication (via cookies)
- Online user tracking 
- Real-time notification broadcasting (`notification:new`, `notification:cleared`)
- Graceful connection/disconnection handling

**Justification:** Real-time communication is essential for a recruitment platform — recruiters and candidates need instant messaging and live notification updates.

**Team:** eaboudi

---

#### 3. User Interaction — Chat and Profiles (Web — Major, 2 pts)

**Implementation:**
- **Chat:** Full conversation system with text, image, video, and file messages. Backend CRUD for conversations and messages (`conversationController.js`, `messageController.js`). Frontend: `ChatSidebar`, `ChatMessages`, `ChatInput`, `ChatHeader` components. Supports typing indicators, read status, and message deletion.
- **Profiles:** Users have detailed profiles with avatar, resume, LinkedIn, portfolio, skills, experience. Frontend pages: `Profile.tsx`, `EditProfile.tsx`, `ProfileCover.tsx`, `ProfileInformations.tsx`.
- The platform uses a recruiter-candidate relationship model instead of a traditional friends system, which is appropriate for the recruitment context.

**Justification:** User interaction is the core of the platform — candidates and recruiters must communicate and present themselves effectively.

**Team:** eaboudi ,ael-fagr, sessarhi

---

#### 4. Public API (Web — Major, 2 pts)

**Implementation:** The Quiz Service exposes a fully documented public API:
- **API Key authentication** via `x-api-key` header with timing-safe comparison (`crypto.timingSafeEqual`)
- **Swagger/OpenAPI documentation** auto-generated with `swagger-jsdoc`
- **12+ endpoints** covering GET, POST, PATCH, DELETE across MCQs, Tests, and internal evaluation
- Secured, documented, and rate-limited as required

**Justification:** A public API allows external tools and integrations to interact with the assessment engine, and demonstrates proper API design practices.

**Team:** sessarhi

---

#### 5. ORM — Prisma (Web — Minor, 1 pt)

**Implementation:** Prisma ORM with MariaDB adapter used in both services:
- **Main service:** 14 models (User, Job, Application, JobPhase, ApplicationPhase, Profile, Interview, Offer, Conversation, Message, etc.)
- **Quiz service:** 3 models (Mcq, CodeChallenge, Test) with many-to-many relations

**Team:**  sessarhi, ibes-sed

---

#### 6. Notification System (Web — Minor, 1 pt)

**Implementation:** Complete real-time notification system covering create, update, and delete actions:
- Backend `notificationService.js`: persists notifications to DB and emits `notification:new` via Socket.IO
- Notification types: `applicationReceived`, `phaseStarted`, `testCompleted`, `interviewScheduled`, `accepted`, `rejected`, `offerSent`, `offerResponse`, `newMessage`
- Frontend `Notifications.tsx`: bell icon with unread count badge, mark as read, mark all as read, clickable navigation to relevant pages
- Chat notification deduplication: only one unread notification per conversation

**Team:** eaboudi

---

#### 7. Custom Design System (Web — Minor, 1 pt)

**Implementation:** 22+ reusable UI components in `srcs/frontend/src/components/ui/`:
- `AppCard`, `CareerCard`, `JobCards`, `QuizCard`, `TestCard`, `UserCard` — card components
- `SearchField`, `JobFilter`, `Pagination` — search and navigation
- `Notifications`, `Icon` — utility components
- `CreateMcq`, `CreateTest`, `CreateOrEditJobForm` — form components
- `JobPhaseManager`, `TestTakingArea`, `McqsList`, `TestsList` — domain components
- Built with Tailwind CSS, `class-variance-authority`, Radix UI, and `tailwind-merge` for consistent theming

**Team:**  ael-fagr

---

#### 8. Advanced Search with Filters, Sorting, Pagination (Web — Minor, 1 pt)

**Implementation:**
- Backend `jobService.js`: supports `page`, `limit`, `sortBy`, `sortOrder`, and filter fields (`keyword`, `skills`, `department`, `employmentType`, `isRemote`, `status`)
- Backend `jobRepository.js`: `findManyJobs()` with `skip`/`take`, `orderBy`, `$transaction` for count + data, returns pagination metadata
- Frontend `JobFilter.tsx`: multi-faceted filtering with filter counts and clear-all button
- Frontend `Pagination.tsx`: page navigation with prev/next
- Keyword search across `title`, `description`, `department`, `skills`

**Team:**  ael-fagr, sessarhi

---

#### 9. File Upload and Management (Web — Minor, 1 pt)

**Implementation:**
- Multer configured with disk storage, dynamic destinations (`avatars/`, `resumes/`, `chat/`, `audio/`)
- File type validation: avatars accept JPEG/PNG/JPG/WEBP; resumes accept PDF only
- Size limit: 10MB, max 2 files per profile upload
- `fileService.js`: `saveAvatar()` with AI classification validation, `saveResume()`, `deleteFile()`, `fileExists()`
- Chat file uploads: images, videos, PDFs, and audio attachments via `ChatInput.tsx`
- Profile routes support `multipart/form-data` for simultaneous avatar + resume upload

**Team:** sessarhi, ael-fagr

---

#### 10. Standard User Management (User Management — Major, 2 pts)

**Implementation:**
- Full user CRUD: create, get, update, delete users
- Profile system: resume, LinkedIn, portfolio, current company/title, skills, years of experience
- Avatar upload with default fallback, AI-powered profile image validation
- Profile pages: `Profile.tsx`, `EditProfile.tsx`, `ProfileCover.tsx`, `ProfileInformations.tsx`
- User model: email, passwordHash (Argon2), role, firstName, lastName, phone, avatarUrl, isVerified

**Team:** sessarhi, ael-fagr

---

#### 11. Advanced Permissions / Roles (User Management — Major, 2 pts)

**Implementation:**
- Three roles: `candidate`, `recruiter`, `admin` (Prisma enum)
- Middleware: `verifyRoles(...allowedRoles)` restricts routes by role, `verifyOwnership()` ensures users access only their own resources (admin bypass)
- Role-protected routes: job CRUD (recruiter/admin), user listing (recruiter), dashboard (recruiter), application management (recruiter/admin)
- Role-based views: conversation controller shows different data per role; candidates see their own conversations, recruiters see all

**Team:** sessarhi

---

#### 12. OAuth 2.0 — Google (User Management — Minor, 1 pt)

**Implementation:**
- `passport-google-oauth2` strategy with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `findUserOrCreate(profile)`: auto-creates user from Google profile if not exists
- Routes: `GET /auth/google` (initiate) and `GET /auth/google/callback` (handle callback)
- Frontend: `OAuthCallback.tsx` component handles redirect flow

**Team:** ael-fagr

---

#### 13. Two-Factor Authentication (User Management — Minor, 1 pt)

**Implementation:**
- `speakeasy` for TOTP secret generation and verification
- `qrcode` package generates QR data URLs for authenticator apps (Google Authenticator, Authy, etc.)
- `twoFAService.js`: `setup()`, `verifySetup()`, `verifyLogin()`, `disable()`
- Database fields: `twoFAEnabled`, `twoFASecret`, `twoFATempSecret` on User model
- Frontend: `QRcode.tsx` and `OtpCode.tsx` components for setup and verification
- Login flow includes `POST /auth/verify-2fa` for 2FA-enabled accounts

**Team:** ibes-sed, ael-fagr

---

#### 14. Content Moderation AI (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- HuggingFace `transformers` pipeline with `Vrandan/Comment-Moderation` model
- Classifies text for: hate speech (H, H2, HR), violence (V, V2), and sexual content (S, S3)
- Score thresholds: Block >= 0.4, Warn >= 0.25, Allow otherwise
- Endpoint: `POST /api/ai/moderate`
- Integrated in `messagesService.js`: every text message is moderated before delivery; blocked messages are rejected with moderation details
- Graceful fallback: if the AI service is unavailable, messages still get through

**Team:** aachalla

---

#### 15. Voice/Speech Integration (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- `faster_whisper` with `WhisperModel("small.en")` running on CPU (int8 quantization)
- Endpoint: `POST /api/ai/recognate` — accepts audio file, returns transcribed text
- Frontend integration in both `AiChat.tsx` and `ChatInput.tsx`:
  - Browser microphone recording via `MediaRecorder` API
  - Transcribed text fills the message input field
- Supports multiple audio codecs: `audio/webm;codecs=opus`, `audio/webm`, `audio/mp4`, `audio/ogg;codecs=opus`

**Team:** aachalla, ael-fagr

---

#### 16. Image Recognition and Tagging (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- Custom CNN built on **ResNet50** (ImageNet pretrained, frozen base layers)
- Architecture: ResNet50 → GlobalAveragePooling2D → Dense(128, relu) → Dropout(0.5) → Dense(2, softmax)
- Custom weights loaded from `profile_classf_model.weights.h5`
- Classifies images as `"valid profile"` or `"non valid profile"`
- Endpoint: `POST /api/ai/classify`
- Integrated in `fileService.js`: avatar uploads are validated via AI — invalid profile images are rejected with HTTP 400

**Team:** aachalla, sessarhi

---

#### 17. WAF/ModSecurity + HashiCorp Vault (Cybersecurity — Major, 2 pts)

**Implementation:**
- **WAF:** OWASP ModSecurity CRS with Nginx (`owasp/modsecurity-crs:nginx` base image). `SecRuleEngine On`, request body inspection enabled. Acts as reverse proxy: `/` → frontend, `/api` → gateway. Deployed as first entry point .
- **HashiCorp Vault:** Runs in standalone mode with Raft storage. KV v2 secrets engine. Kubernetes authentication with per-service policies (main-service, quiz-service, ai-service, main-service-db, quiz-service-db). Secrets injected via Vault Agent sidecar annotations. Stores: DB credentials, JWT secrets, OAuth secrets, API keys.

**Justification:** Security is critical for a recruitment platform that handles personal data, resumes, and authentication credentials. The WAF protects against OWASP top-10 attacks, while Vault ensures secrets are never stored in plaintext or environment files in production.

**Team:** ibes-sed

---

#### 18. Backend as Microservices (DevOps — Major, 2 pts)

**Implementation:** Four loosely coupled services with clear interfaces:

| Service | Technology | Port | Responsibility |
|---------|-----------|------|----------------|
| main_service | Node.js / Express | 3000 | Users, auth, jobs, applications, chat, notifications, profiles |
| quiz_service | Node.js / Express | 3001 | MCQs, tests, code challenges, evaluation |
| ai_service | Python / FastAPI | 3002 | Text moderation, speech recognition, image classification |
| gateway | Java / Spring Cloud Gateway | 8081 | API routing to all services |

- Each service has its own Dockerfile, database, and Prisma schema
- Inter-service communication via REST (main_service calls quiz_service via `quizClientService.js`)
- API routing through the gateway: `/api/main/**`, `/api/quiz/**`, `/api/ai/**`
- Full Docker Compose and Kubernetes deployment manifests

**Team:** ibes-sed (architecture), sessarhi, aachalla, ael-fagr

---

#### 19. Advanced Analytics Dashboard (Data and Analytics — Major, 2 pts)

**Implementation:**
- **Backend:** `dashboardService.js` and `dashboardRepository.js` compute KPIs with period-over-period comparison, applications overview (time-series), active candidates, recent activity, hiring funnel, and recruitment status breakdown. Results cached with 24-hour TTL.
- **Frontend:** `Dashboard.tsx` with KPI stat cards showing trend indicators (increase/decrease). Four interactive chart sections:
  - `OverviewStatistics.tsx` — Line chart: applications received vs processed over time (Recharts)
  - `RecruitmentPieChart.tsx` — Donut chart: application status breakdown
  - `ActiveCondidates.tsx` — Top 10 active candidates list
  - `RecentActivity.tsx` — Latest application activity feed

**Justification:** Recruiters need data-driven insights to manage their hiring pipeline effectively. The dashboard provides real-time visibility into recruitment metrics.

**Team:** ael-fagr, sessarhi

---

### 20. Kubernetes Deployment & Orchestration (Modules of Choice — Major, 2 pts)

**Justification:** This module demonstrates full **Kubernetes-native deployment and orchestration** for the Hirefy microservices platform, ensuring scalability, resilience, and declarative infrastructure management.

**Implementation:**
- **K3d Cluster:** Local development and testing uses a `k3d` Kubernetes cluster with separate namespaces for services.
- **Microservices Deployment:** Each service (main, quiz, AI, gateway, WAF) runs in its own Deployment with a dedicated Service:
  - **main-service**: Node.js / Express
  - **quiz-service**: Node.js / Express
  - **ai-service**: FastAPI / Python
  - **gateway**: Spring Boot / Java
  - **WAF**: ModSecurity + Nginx
- **Persistent Storage:** MariaDB databases deployed with PersistentVolumeClaims to retain data.
- **Secrets Management:** HashiCorp Vault integrates with Kubernetes via the **Vault Agent Injector**, injecting DB credentials, JWT secrets, and API keys directly into pods.
- **Configuration Management:** Environment variables and service URLs managed via ConfigMaps and Secrets.
- **Ingress & Routing:** Frontend, gateway, and AI service are exposed using **Ingress** and internal ClusterIP Services, with WAF handling incoming traffic and security rules.


**Team:** ibes-sed 

---

#### 21. Implement a complete LLM system interface. (AI — Mijor, 1 pt)

**Justification:** This is a custom module providing a standalone assessment microservice. It goes beyond simple quiz functionality by supporting two assessment types (MCQ and code challenges), test composition from a library of questions, automated evaluation, and integration with the recruitment pipeline.

**Implementation:**
- Implemented using local llm model (llama3.2:1b) pulled using ollama tool
- MCQ system: questions with 4 choices (JSON), points, explanations, difficulty levels
- Code challenge system: starter code, test cases (JSON), time/memory limits, multi-language support
- Test composition: compose tests from MCQs and/or code challenges with passing score thresholds
- Evaluation: `POST /api/rag` scores submitted answers
- Frontend: `QuizPage.tsx`, `CandidateQuizPage.tsx`, `CreateMcq.tsx`, `CreateTest.tsx`, `TestTakingArea.tsx`

**Team:** aachalla

Major: Implement a complete LLM system interface.
◦ Generate text and/or images based on user input.
◦ Handle streaming responses properly.
◦ Implement error handling and rate limiting.
• Major: Recommendation system using machine learning.
◦ Personalized recommendations based on user behavior.
◦ Collaborative filtering or content-based filtering.
◦ Continuously improve recommendations over time.

#### 14. Content Moderation AI (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- HuggingFace `transformers` pipeline with `Vrandan/Comment-Moderation` model
- Classifies text for: hate speech (H, H2, HR), violence (V, V2), and sexual content (S, S3)
- Score thresholds: Block >= 0.4, Warn >= 0.25, Allow otherwise
- Endpoint: `POST /api/ai/moderate`
- Integrated in `messagesService.js`: every text message is moderated before delivery; blocked messages are rejected with moderation details
- Graceful fallback: if the AI service is unavailable, messages still get through
