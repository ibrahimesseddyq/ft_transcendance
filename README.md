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
| 20 | Recruitment Pipeline System (Custom) | Modules of Choice | Major | 2 | Implemented |
| 21 | Quiz/Assessment Engine (Custom) | Modules of Choice | Minor | 1 | Implemented |
| | | | **Total** | **31** | |

**Breakdown:** 10 Major modules (10 x 2 = 20 pts) + 11 Minor modules (11 x 1 = 11 pts) = **31 points** (14 required to pass, 5 bonus points max).

### Module Details

#### 1. Frontend + Backend Frameworks (Web — Major, 2 pts)

**Implementation:** React 19 with Vite, TypeScript, and Tailwind CSS for the frontend. Express 4 (main service) and Express 5 (quiz service) for the backend. FastAPI (Python) for the AI service. Spring Cloud Gateway (Java) for API routing.

**Justification:** Using a framework for both sides is the foundation of the project. React provides component-based UI composition with a mature ecosystem (React Query, Zustand, React Router). Express was chosen for its simplicity and large middleware ecosystem.

**Team:** ibes-sed (architecture decisions), eaboudi (frontend + backend implementation), aachalla (quiz service)

---

#### 2. Real-time Features via WebSockets (Web — Major, 2 pts)

**Implementation:** Socket.IO server in the main service handles:
- JWT-based socket authentication (via cookies)
- Online user tracking with `Map<userId, Set<socketId>>`
- Events: `join:conversation`, `typing:start`, `typing:stop`, `message:new`, `message:received`, `user:online`, `user:offline`
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

**Team:** eaboudi (chat system, profiles), ael-fagr (profile design)

---

#### 4. Public API (Web — Major, 2 pts)

**Implementation:** The Quiz Service exposes a fully documented public API:
- **API Key authentication** via `x-api-key` header with timing-safe comparison (`crypto.timingSafeEqual`)
- **Rate limiting**: 100 requests/15min for reads, 30 requests/15min for writes (`express-rate-limit`)
- **Swagger/OpenAPI documentation** auto-generated with `swagger-jsdoc`
- **12+ endpoints** covering GET, POST, PATCH, DELETE across MCQs, Tests, and internal evaluation
- Secured, documented, and rate-limited as required

**Justification:** A public API allows external tools and integrations to interact with the assessment engine, and demonstrates proper API design practices.

**Team:** aachalla

---

#### 5. ORM — Prisma (Web — Minor, 1 pt)

**Implementation:** Prisma ORM with MariaDB adapter used in both services:
- **Main service:** 14 models (User, Job, Application, JobPhase, ApplicationPhase, Profile, Interview, Offer, Conversation, Message, etc.)
- **Quiz service:** 3 models (Mcq, CodeChallenge, Test) with many-to-many relations

**Team:** ibes-sed (schema design), eaboudi, aachalla

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

**Team:** eaboudi, ael-fagr, sessarhi

---

#### 8. Advanced Search with Filters, Sorting, Pagination (Web — Minor, 1 pt)

**Implementation:**
- Backend `jobService.js`: supports `page`, `limit`, `sortBy`, `sortOrder`, and filter fields (`keyword`, `skills`, `department`, `employmentType`, `isRemote`, `status`)
- Backend `jobRepository.js`: `findManyJobs()` with `skip`/`take`, `orderBy`, `$transaction` for count + data, returns pagination metadata
- Frontend `JobFilter.tsx`: multi-faceted filtering with filter counts and clear-all button
- Frontend `Pagination.tsx`: page navigation with prev/next
- Keyword search across `title`, `description`, `department`, `skills`

**Team:** eaboudi, ael-fagr

---

#### 9. File Upload and Management (Web — Minor, 1 pt)

**Implementation:**
- Multer configured with disk storage, dynamic destinations (`avatars/`, `resumes/`, `chat/`, `audio/`)
- File type validation: avatars accept JPEG/PNG/JPG/WEBP; resumes accept PDF only
- Size limit: 10MB, max 2 files per profile upload
- `fileService.js`: `saveAvatar()` with AI classification validation, `saveResume()`, `deleteFile()`, `fileExists()`
- Chat file uploads: images, videos, PDFs, and audio attachments via `ChatInput.tsx`
- Profile routes support `multipart/form-data` for simultaneous avatar + resume upload

**Team:** eaboudi

---

#### 10. Standard User Management (User Management — Major, 2 pts)

**Implementation:**
- Full user CRUD: create, get, update, delete users
- Profile system: resume, LinkedIn, portfolio, current company/title, skills, years of experience
- Avatar upload with default fallback, AI-powered profile image validation
- Profile pages: `Profile.tsx`, `EditProfile.tsx`, `ProfileCover.tsx`, `ProfileInformations.tsx`
- User model: email, passwordHash (Argon2), role, firstName, lastName, phone, avatarUrl, isVerified

**Team:** eaboudi, ibes-sed

---

#### 11. Advanced Permissions / Roles (User Management — Major, 2 pts)

**Implementation:**
- Three roles: `candidate`, `recruiter`, `admin` (Prisma enum)
- Middleware: `verifyRoles(...allowedRoles)` restricts routes by role, `verifyOwnership()` ensures users access only their own resources (admin bypass)
- Role-protected routes: job CRUD (recruiter/admin), user listing (recruiter), dashboard (recruiter), application management (recruiter/admin)
- Role-based views: conversation controller shows different data per role; candidates see their own conversations, recruiters see all

**Team:** eaboudi, ibes-sed

---

#### 12. OAuth 2.0 — Google (User Management — Minor, 1 pt)

**Implementation:**
- `passport-google-oauth2` strategy with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `findUserOrCreate(profile)`: auto-creates user from Google profile if not exists
- Routes: `GET /auth/google` (initiate) and `GET /auth/google/callback` (handle callback)
- Frontend: `OAuthCallback.tsx` component handles redirect flow

**Team:** eaboudi, ibes-sed

---

#### 13. Two-Factor Authentication (User Management — Minor, 1 pt)

**Implementation:**
- `speakeasy` for TOTP secret generation and verification
- `qrcode` package generates QR data URLs for authenticator apps (Google Authenticator, Authy, etc.)
- `twoFAService.js`: `setup()`, `verifySetup()`, `verifyLogin()`, `disable()`
- Database fields: `twoFAEnabled`, `twoFASecret`, `twoFATempSecret` on User model
- Frontend: `QRcode.tsx` and `OtpCode.tsx` components for setup and verification
- Login flow includes `POST /auth/verify-2fa` for 2FA-enabled accounts

**Team:** eaboudi, ibes-sed

---

#### 14. Content Moderation AI (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- HuggingFace `transformers` pipeline with `Vrandan/Comment-Moderation` model
- Classifies text for: hate speech (H, H2, HR), violence (V, V2), and sexual content (S, S3)
- Score thresholds: Block >= 0.4, Warn >= 0.25, Allow otherwise
- Endpoint: `POST /api/ai/moderate`
- Integrated in `messagesService.js`: every text message is moderated before delivery; blocked messages are rejected with moderation details
- Graceful fallback: if the AI service is unavailable, messages still get through

**Team:** eaboudi

---

#### 15. Voice/Speech Integration (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- `faster_whisper` with `WhisperModel("small.en")` running on CPU (int8 quantization)
- Endpoint: `POST /api/ai/recognate` — accepts audio file, returns transcribed text
- Frontend integration in both `AiChat.tsx` and `ChatInput.tsx`:
  - Browser microphone recording via `MediaRecorder` API
  - Recording timer with 30-second max
  - Transcribed text fills the message input field
- Supports multiple audio codecs: `audio/webm;codecs=opus`, `audio/webm`, `audio/mp4`, `audio/ogg;codecs=opus`

**Team:** eaboudi

---

#### 16. Image Recognition and Tagging (Artificial Intelligence — Minor, 1 pt)

**Implementation:**
- Custom CNN built on **ResNet50** (ImageNet pretrained, frozen base layers)
- Architecture: ResNet50 → GlobalAveragePooling2D → Dense(128, relu) → Dropout(0.5) → Dense(2, softmax)
- Custom weights loaded from `profile_classf_model.weights.h5`
- Classifies images as `"valid profile"` or `"non valid profile"`
- Endpoint: `POST /api/ai/classify`
- Integrated in `fileService.js`: avatar uploads are validated via AI — invalid profile images are rejected with HTTP 400

**Team:** eaboudi

---

#### 17. WAF/ModSecurity + HashiCorp Vault (Cybersecurity — Major, 2 pts)

**Implementation:**
- **WAF:** OWASP ModSecurity CRS with Nginx (`owasp/modsecurity-crs:nginx` base image). `SecRuleEngine On`, request body inspection enabled. Acts as reverse proxy: `/` → frontend, `/api` → gateway. Deployed as first entry point on port 8080.
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

**Team:** ibes-sed (architecture), eaboudi (main_service), aachalla (quiz_service)

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

**Team:** ael-fagr, sessarhi, eaboudi

---

#### 20. Recruitment Pipeline System (Modules of Choice — Major, 2 pts)

**Justification:** This is a custom module unique to the Hirefy platform. It implements a full multi-phase recruitment pipeline that does not exist in the subject's predefined modules. It demonstrates significant technical complexity:
- Configurable job phases (test/interview) with ordering
- Application state machine (pending → inProgress → accepted/rejected/withdrawn)
- Per-phase status tracking with scores and notes
- Interview scheduling with participants and modes (online/onsite)
- Offer management (salary, equity, benefits, status lifecycle)
- Integration with the quiz service for automated assessments within pipeline phases

**Implementation:**
- Prisma models: `JobPhase`, `Application`, `ApplicationPhase`, `Interview`, `InterviewParticipant`, `Offer`
- Backend: `applicationService.js` handles `submitApplication()`, `advance()`, `acceptApplication()`, `rejectApplication()` with real-time notifications at each stage
- Frontend: `Application.tsx`, `ApplicationDetails.tsx`, `UserApplications.tsx`, `UserPhase.tsx`, `CandidateQuizPage.tsx`

**Why it deserves Major status (2 pts):** The pipeline system involves 6 interrelated database models, a state machine with validation rules, integration across two microservices (main + quiz), and real-time notification triggers — making it substantially more complex than most predefined modules.

**Team:** ibes-sed (architecture, models), eaboudi (implementation), ael-fagr (requirements)

---

#### 21. Quiz/Assessment Engine (Modules of Choice — Minor, 1 pt)

**Justification:** This is a custom module providing a standalone assessment microservice. It goes beyond simple quiz functionality by supporting two assessment types (MCQ and code challenges), test composition from a library of questions, automated evaluation, and integration with the recruitment pipeline.

**Implementation:**
- Dedicated microservice (`quiz_service`) with its own database, Prisma schema, and Swagger-documented API
- MCQ system: questions with 4 choices (JSON), points, explanations, difficulty levels
- Code challenge system: starter code, test cases (JSON), time/memory limits, multi-language support
- Test composition: compose tests from MCQs and/or code challenges with passing score thresholds
- Evaluation: `POST /internal/:testId/evaluate` scores submitted answers
- Frontend: `QuizPage.tsx`, `CandidateQuizPage.tsx`, `CreateMcq.tsx`, `CreateTest.tsx`, `TestTakingArea.tsx`

**Team:** aachalla

## Individual Contributions

### sessarhi — PO (Project Manager)

**Role & Responsibilities:** Coordinated sprints, tracked progress, managed priorities, organized team meetings, and ensured deadlines were met. Facilitated communication between team members via Discord.

**Specific contributions:**
- Managed the project backlog and sprint planning using GitHub Issues
- Coordinated task distribution across all team members
- Contributed to the recruiter dashboard UI (`Dashboard.tsx`, KPI stat cards)
- Helped design and implement the custom design system (UI component styling and consistency)
- Participated in the analytics dashboard feature (layout, data presentation)
- Tracked progress and resolved blockers for the team throughout the project lifecycle

**Challenges faced:**
- Coordinating work across 5 team members working on different microservices simultaneously. Overcame this by establishing clear task ownership via GitHub Issues and regular Discord syncs.

---

### eaboudi — Developer

**Role & Responsibilities:** Full-stack developer responsible for the majority of feature implementation across both frontend and backend, with a focus on real-time communication, AI integration, and user-facing features.

**Specific contributions:**
- **Real-time chat system** — Built the complete Socket.IO server (`chatSocketServer.js`), conversation and message controllers, and the full chat frontend (`ChatSidebar`, `ChatMessages`, `ChatInput`, `ChatHeader`)
- **Real-time notifications** — Implemented `notificationService.js`, socket-based broadcasting, and the frontend notification bell component with unread badge
- **AI integration** — Connected the frontend to all three AI service endpoints: speech-to-text (Whisper), text moderation (HuggingFace), and image classification (ResNet50). Built the `AiChat.tsx` page and voice recording in `ChatInput.tsx`
- **Authentication flow** — Implemented JWT access/refresh token lifecycle, Google OAuth integration (`passport.js`, `OAuthCallback.tsx`), and 2FA setup/verify flow (`twoFAService.js`, `QRcode.tsx`, `OtpCode.tsx`)
- **User management** — Built user CRUD, profile CRUD, avatar/resume upload with AI validation (`fileService.js`, `profileService.js`)
- **Application pipeline frontend** — Implemented `Application.tsx`, `ApplicationDetails.tsx`, `UserApplications.tsx`, `UserPhase.tsx`
- **File upload system** — Configured Multer, built `fileService.js` with type/size validation, and chat file attachments
- **Search and filtering** — Built `JobFilter.tsx`, `Pagination.tsx`, and backend filtering/sorting logic in `jobService.js`
- **Notification system** — Full backend + frontend implementation with 9 notification types
- **Custom design system** — Created multiple reusable UI components (`AppCard`, `CareerCard`, `Notifications`, `SearchField`, etc.)
- **Content moderation integration** — Wired `messagesService.js` to call the AI moderation endpoint before delivering messages

**Challenges faced:**
- Debugging the audio transcription 404 error caused by missing `VITE_AI_SERVICE_URL` and `VITE_AI_API_URL` environment variables. Traced the issue across the full request pipeline (MediaRecorder → axios → FastAPI → Whisper) to identify the root cause.
- Handling Socket.IO authentication with JWT cookies across different origins. Solved by implementing cookie-based token extraction with a fallback to query-string tokens.

---

### ibes-sed — Architect

**Role & Responsibilities:** Designed the overall microservices architecture, database schemas, and infrastructure. Made technology stack decisions and reviewed critical code changes.

**Specific contributions:**
- **Microservices architecture** — Designed the separation of concerns across main_service, quiz_service, ai_service, and gateway. Defined inter-service communication patterns (REST via gateway routing)
- **Database schema design** — Designed the Prisma schemas for both services: 14 models in main_service (User, Job, Application, JobPhase, ApplicationPhase, Interview, Offer, Conversation, Message, etc.) and 3 models in quiz_service
- **API Gateway** — Built the Spring Cloud Gateway (`GatewayApplication.java`) with route configuration for `/api/main/**`, `/api/quiz/**`, `/api/ai/**`
- **WAF/ModSecurity** — Configured the OWASP ModSecurity CRS with Nginx (`modsecurity.conf`, `nginx.conf`, Dockerfile) as the first entry point for all traffic
- **HashiCorp Vault** — Set up secrets management with KV v2, Kubernetes auth, per-service policies, and the `init_vault.sh` provisioning script
- **Kubernetes deployment** — Created all 16 k8s manifests (namespace, service accounts, PVCs, deployments, services, ingress, TLS). Configured Vault sidecar injection for secret delivery.
- **Recruitment pipeline architecture** — Designed the multi-phase application pipeline (JobPhase → ApplicationPhase → Interview → Offer) with the state machine logic
- **Authentication architecture** — Designed the JWT access/refresh token strategy, 2FA flow, and Google OAuth integration
- **Role-based access control** — Designed the three-role permission system (candidate/recruiter/admin) with middleware-level enforcement

**Challenges faced:**
- Designing the inter-service communication pattern between main_service and quiz_service for pipeline-integrated assessments. Solved by creating an internal API on the quiz_service (`/internal/:testId/evaluate`) called by the main_service via `quizClientService.js`, keeping services loosely coupled.
- Configuring Vault Kubernetes authentication with proper service account bindings and per-service policies. Overcame this through iterative testing with `init_vault.sh` and careful RBAC configuration.

---

### ael-fagr — PO (Product Owner)

**Role & Responsibilities:** Defined the product vision, prioritized features, wrote acceptance criteria, and validated completed work. Ensured the project met user needs from both candidate and recruiter perspectives.

**Specific contributions:**
- **Product requirements** — Defined feature specifications for the recruitment pipeline, job management, and dashboard
- **Recruiter dashboard** — Contributed to the analytics dashboard design and implementation (`Dashboard.tsx`, `RecruitmentPieChart.tsx`, `OverviewStatistics.tsx`)
- **Job management features** — Helped define and validate job posting, listing, and filtering functionality
- **Profile design** — Contributed to the candidate and recruiter profile page designs
- **Search and filtering UX** — Helped design the `JobFilter.tsx` filtering experience with multi-faceted filters
- **Custom design system** — Contributed to UI component design and styling consistency
- **Recruitment pipeline requirements** — Defined the multi-phase application flow from a product perspective (which phases, what statuses, when to notify)
- **Feature validation** — Tested completed features against acceptance criteria and provided feedback

**Challenges faced:**
- Balancing feature scope with project timeline. Prioritized the core recruitment flow (jobs → applications → pipeline → offers) over nice-to-have features to ensure a solid MVP.

---

### aachalla — Developer

**Role & Responsibilities:** Backend developer focused on the quiz and assessment microservice, building the complete assessment engine as a standalone service.

**Specific contributions:**
- **Quiz service (entire microservice)** — Built the complete `quiz_service` from scratch:
  - Prisma schema with 3 models (`Mcq`, `CodeChallenge`, `Test`) and many-to-many relationships
  - Full CRUD controllers and repositories for MCQs, code challenges, and tests
  - Internal evaluation API (`/internal/:testId/evaluate`) for automated scoring
  - API key authentication middleware (`verifyApiKey.js`) with timing-safe comparison
  - Rate limiting middleware (`rateLimiter.js`) with separate limits for reads and writes
  - Swagger/OpenAPI documentation (`swagger.js`) with full endpoint and schema descriptions
- **Public API** — Designed and documented 12+ endpoints covering GET, POST, PATCH, DELETE across MCQs and Tests
- **Quiz frontend components** — Built `QuizPage.tsx`, `CandidateQuizPage.tsx`, `CreateMcq.tsx`, `CreateTest.tsx`, `TestCard.tsx`, `TestTakingArea.tsx`, `McqsList.tsx`, `TestsList.tsx`, `QuizCard.tsx`
- **Quiz-pipeline integration** — Worked with ibes-sed to integrate the quiz evaluation with the main_service recruitment pipeline via `quizClientService.js`

**Challenges faced:**
- Designing the test composition system to support both MCQ and code challenge types within a single test. Solved by using Prisma's implicit many-to-many relations and a JSON-based structure for choices and test cases, allowing flexible test creation.
- Implementing secure API key authentication for the public API while keeping the internal evaluation endpoint accessible to the main_service. Solved by separating public routes (API key protected) from internal routes (service-to-service trust).
