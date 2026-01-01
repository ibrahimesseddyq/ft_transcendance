SET default_storage_engine = InnoDB;


CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('candidate', 'recruiter', 'admin') NOT NULL DEFAULT 'candidate',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE candidate_profiles (
    user_id CHAR(36) PRIMARY KEY,
    resume_url TEXT,
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    current_company VARCHAR(255),
    current_title VARCHAR(255),
    years_experience INT,
    skills JSON,
    preferred_locations JSON,
    salary_expectation VARCHAR(50),
    available_from DATE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    requirements JSON,
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    employment_type VARCHAR(50),
    salary_min INT,
    salary_max INT,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('open', 'closed', 'archived') DEFAULT 'open',
    created_by CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE job_phases (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id CHAR(36) NOT NULL,
    phase_type ENUM('test', 'interview') NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    duration_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_job_order (job_id, order_index),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE phase_tests (
    phase_id CHAR(36) PRIMARY KEY,
    test_id CHAR(36) NOT NULL,
    
    FOREIGN KEY (phase_id) REFERENCES job_phases(id) ON DELETE CASCADE
    -- Note: test_id references quiz_service.tests (no FK constraint across services)
);

CREATE TABLE phase_interviews (
    phase_id CHAR(36) PRIMARY KEY,
    interview_mode ENUM('online', 'onsite') NOT NULL,
    location VARCHAR(255),
    has_whiteboard BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (phase_id) REFERENCES job_phases(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    job_id CHAR(36) NOT NULL,
    candidate_id CHAR(36) NOT NULL,
    status ENUM('pending', 'in_progress', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
    current_phase_id CHAR(36),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_application (job_id, candidate_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_phase_id) REFERENCES job_phases(id) ON DELETE SET NULL
);

CREATE TABLE application_phases (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL,
    phase_id CHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    score INT,
    
    UNIQUE KEY unique_app_phase (application_id, phase_id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (phase_id) REFERENCES job_phases(id) ON DELETE CASCADE
);

CREATE TABLE interviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_phase_id CHAR(36) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT DEFAULT 60,
    interview_mode ENUM('online', 'onsite') NOT NULL,
    location VARCHAR(255),
    whiteboard_session_id CHAR(36),
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_phase_id) REFERENCES application_phases(id) ON DELETE CASCADE
);


CREATE TABLE interview_participants (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    interview_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role VARCHAR(50),
    joined_at TIMESTAMP NULL,
    left_at TIMESTAMP NULL,
    
    UNIQUE KEY unique_participant (interview_id, user_id),
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE offers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_id CHAR(36) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    salary INT NOT NULL,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    bonus INT,
    equity VARCHAR(100),
    start_date DATE,
    benefits TEXT,
    additional_terms TEXT,
    status ENUM('pending', 'accepted', 'declined', 'expired') DEFAULT 'pending',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    responded_at TIMESTAMP NULL,
    response_notes TEXT,
    
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);


CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    type ENUM('application_received', 'phase_started', 'test_completed', 'interview_scheduled', 'accepted', 'rejected', 'offer_sent', 'offer_response') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_type VARCHAR(50),
    reference_id CHAR(36),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at, status);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_application_phases_status ON application_phases(application_id, status);

CREATE VIEW application_pipeline AS
SELECT 
    a.id AS application_id,
    a.status AS application_status,
    j.id AS job_id,
    j.title AS job_title,
    u.id AS candidate_id,
    CONCAT(u.first_name, ' ', u.last_name) AS candidate_name,
    u.email AS candidate_email,
    jp.name AS current_phase_name,
    jp.order_index AS current_phase_order,
    a.applied_at
FROM applications a
JOIN jobs j ON a.job_id = j.id
JOIN users u ON a.candidate_id = u.id
LEFT JOIN job_phases jp ON a.current_phase_id = jp.id;