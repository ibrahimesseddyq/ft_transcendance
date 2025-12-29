-- ============================================================================
-- ARCHIVE TABLES SCHEMA
-- Recruitment Platform - Data Archiving Strategy
-- ============================================================================

SET default_storage_engine = InnoDB;

-- ----------------------------------------------------------------------------
-- 1. ARCHIVED APPLICATIONS (from main_service)
-- ----------------------------------------------------------------------------
CREATE TABLE applications_archive (
    -- Original columns
    id CHAR(36) PRIMARY KEY,
    job_id CHAR(36) NOT NULL,
    candidate_id CHAR(36) NOT NULL,
    status ENUM('pending', 'in_progress', 'accepted', 'rejected', 'withdrawn') NOT NULL,
    current_phase_id CHAR(36),
    applied_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived_by VARCHAR(100) DEFAULT 'system',
    archive_reason ENUM('completed', 'rejected', 'withdrawn', 'expired', 'gdpr_request') NOT NULL,
    retention_until DATE NOT NULL,
    
    INDEX idx_archive_candidate (candidate_id),
    INDEX idx_archive_job (job_id),
    INDEX idx_archive_retention (retention_until),
    INDEX idx_archive_date (archived_at)
);

-- ----------------------------------------------------------------------------
-- 2. ARCHIVED APPLICATION PHASES
-- ----------------------------------------------------------------------------
CREATE TABLE application_phases_archive (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    phase_id CHAR(36) NOT NULL,
    status VARCHAR(20),
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    score INT,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_application (application_id)
);

-- ----------------------------------------------------------------------------
-- 3. ARCHIVED INTERVIEWS
-- ----------------------------------------------------------------------------
CREATE TABLE interviews_archive (
    id CHAR(36) PRIMARY KEY,
    application_phase_id CHAR(36) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT,
    interview_mode ENUM('online', 'onsite') NOT NULL,
    location VARCHAR(255),
    whiteboard_session_id CHAR(36),
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'),
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    created_at TIMESTAMP,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_app_phase (application_phase_id)
);

-- ----------------------------------------------------------------------------
-- 4. ARCHIVED INTERVIEW PARTICIPANTS
-- ----------------------------------------------------------------------------
CREATE TABLE interview_participants_archive (
    id CHAR(36) PRIMARY KEY,
    interview_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role VARCHAR(50),
    joined_at TIMESTAMP NULL,
    left_at TIMESTAMP NULL,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_interview (interview_id)
);

-- ----------------------------------------------------------------------------
-- 5. ARCHIVED OFFERS
-- ----------------------------------------------------------------------------
CREATE TABLE offers_archive (
    id CHAR(36) PRIMARY KEY,
    application_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    salary INT NOT NULL,
    salary_currency VARCHAR(3),
    bonus INT,
    equity VARCHAR(100),
    start_date DATE,
    benefits TEXT,
    additional_terms TEXT,
    status ENUM('pending', 'accepted', 'declined', 'expired'),
    sent_at TIMESTAMP,
    expires_at TIMESTAMP NULL,
    responded_at TIMESTAMP NULL,
    response_notes TEXT,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    retention_until DATE NOT NULL,
    
    INDEX idx_archive_application (application_id),
    INDEX idx_archive_retention (retention_until)
);

-- ----------------------------------------------------------------------------
-- 6. ARCHIVED NOTIFICATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE notifications_archive (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    type ENUM('application_received', 'phase_started', 'test_completed', 'interview_scheduled', 'accepted', 'rejected', 'offer_sent', 'offer_response') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_type VARCHAR(50),
    reference_id CHAR(36),
    is_read BOOLEAN,
    created_at TIMESTAMP,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_user (user_id),
    INDEX idx_archive_date (archived_at)
);

-- ----------------------------------------------------------------------------
-- 7. ARCHIVED JOBS
-- ----------------------------------------------------------------------------
CREATE TABLE jobs_archive (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    requirements JSON,
    location VARCHAR(255),
    is_remote BOOLEAN,
    employment_type VARCHAR(50),
    salary_min INT,
    salary_max INT,
    salary_currency VARCHAR(3),
    status ENUM('open', 'closed', 'archived'),
    created_by CHAR(36),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    closed_at TIMESTAMP NULL,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    retention_until DATE NOT NULL,
    
    INDEX idx_archive_retention (retention_until),
    INDEX idx_archive_date (archived_at)
);

-- ----------------------------------------------------------------------------
-- 8. ARCHIVED TEST SUBMISSIONS (from quiz_service)
-- ----------------------------------------------------------------------------
CREATE TABLE test_submissions_archive (
    id CHAR(36) PRIMARY KEY,
    application_phase_id CHAR(36) NOT NULL,
    candidate_id CHAR(36) NOT NULL,
    test_id CHAR(36) NOT NULL,
    started_at TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    score INT,
    passed BOOLEAN,
    time_spent_seconds INT,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_candidate (candidate_id),
    INDEX idx_archive_test (test_id)
);

-- ----------------------------------------------------------------------------
-- 9. ARCHIVED QCM ANSWERS
-- ----------------------------------------------------------------------------
CREATE TABLE qcm_answers_archive (
    id CHAR(36) PRIMARY KEY,
    submission_id CHAR(36) NOT NULL,
    question_id CHAR(36) NOT NULL,
    selected_option_id VARCHAR(50),
    is_correct BOOLEAN,
    answered_at TIMESTAMP,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_submission (submission_id)
);

-- ----------------------------------------------------------------------------
-- 10. ARCHIVED CODE SUBMISSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE code_submissions_archive (
    id CHAR(36) PRIMARY KEY,
    submission_id CHAR(36) NOT NULL,
    challenge_id CHAR(36) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    language VARCHAR(50),
    test_results JSON,
    score INT,
    submitted_at TIMESTAMP,
    
    -- Archive metadata
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_archive_submission (submission_id)
);

-- ----------------------------------------------------------------------------
-- ARCHIVE TRACKING TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE archive_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    records_archived INT NOT NULL,
    records_purged INT DEFAULT 0,
    archive_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archive_criteria TEXT,
    executed_by VARCHAR(100) DEFAULT 'system',
    execution_time_ms INT,
    status ENUM('success', 'failed', 'partial') DEFAULT 'success',
    error_message TEXT,
    
    INDEX idx_log_date (archive_date),
    INDEX idx_log_table (table_name)
);
