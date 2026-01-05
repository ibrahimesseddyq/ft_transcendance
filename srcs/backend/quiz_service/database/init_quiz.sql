SET default_storage_engine = InnoDB;


CREATE TABLE tests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    test_type ENUM('qcm', 'code') NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    passing_score INT,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
    -- Note: created_by references main_service.users (no FK constraint across services)
);

CREATE TABLE qcm_questions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    test_id CHAR(36) NOT NULL,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    points INT DEFAULT 1,
    order_index INT NOT NULL,
    
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE code_challenges (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    test_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    initial_code TEXT,
    language VARCHAR(50) NOT NULL,
    test_cases JSON,
    points INT DEFAULT 1,
    order_index INT NOT NULL,
    
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE test_submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    application_phase_id CHAR(36) NOT NULL,
    candidate_id CHAR(36) NOT NULL,
    test_id CHAR(36) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    score INT,
    passed BOOLEAN,
    time_spent_seconds INT,
    
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    
    -- Note: application_phase_id references main_service.application_phases
    -- Note: candidate_id references main_service.users
);

CREATE TABLE qcm_answers (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    submission_id CHAR(36) NOT NULL,
    question_id CHAR(36) NOT NULL,
    selected_option_id VARCHAR(50),
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (submission_id) REFERENCES test_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES qcm_questions(id) ON DELETE CASCADE
);

CREATE TABLE code_submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    submission_id CHAR(36) NOT NULL,
    challenge_id CHAR(36) NOT NULL,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    language VARCHAR(50),
    test_results JSON,
    score INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (submission_id) REFERENCES test_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES code_challenges(id) ON DELETE CASCADE
);

CREATE INDEX idx_tests_type ON tests(test_type);
CREATE INDEX idx_tests_created_by ON tests(created_by);
CREATE INDEX idx_qcm_questions_test ON qcm_questions(test_id);
CREATE INDEX idx_code_challenges_test ON code_challenges(test_id);
CREATE INDEX idx_test_submissions_candidate ON test_submissions(candidate_id);
CREATE INDEX idx_test_submissions_test ON test_submissions(test_id);
CREATE INDEX idx_test_submissions_app_phase ON test_submissions(application_phase_id);
CREATE INDEX idx_qcm_answers_submission ON qcm_answers(submission_id);
CREATE INDEX idx_code_submissions_submission ON code_submissions(submission_id);

CREATE VIEW test_summary AS
SELECT 
    t.id AS test_id,
    t.title,
    t.test_type,
    t.duration_minutes,
    t.passing_score,
    COUNT(DISTINCT ts.id) AS total_submissions,
    AVG(ts.score) AS avg_score,
    SUM(CASE WHEN ts.passed = TRUE THEN 1 ELSE 0 END) AS passed_count
FROM tests t
LEFT JOIN test_submissions ts ON t.id = ts.test_id
GROUP BY t.id, t.title, t.test_type, t.duration_minutes, t.passing_score;

CREATE VIEW submission_details AS
SELECT 
    ts.id AS submission_id,
    ts.candidate_id,
    ts.application_phase_id,
    t.id AS test_id,
    t.title AS test_title,
    t.test_type,
    ts.score,
    ts.passed,
    ts.time_spent_seconds,
    ts.started_at,
    ts.submitted_at
FROM test_submissions ts
JOIN tests t ON ts.test_id = t.id;