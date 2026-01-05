-- ============================================================================
-- ARCHIVE STORED PROCEDURES
-- Recruitment Platform - Automated Archiving Jobs
-- ============================================================================

DELIMITER //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Archive Old Applications
-- Archives applications that are rejected/withdrawn for more than 6 months
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_archive_applications(
    IN p_months_old INT,
    IN p_retention_years INT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_start_time DATETIME;
    DECLARE v_execution_ms INT;
    
    SET v_start_time = NOW();
    
    -- Start transaction
    START TRANSACTION;
    
    -- Archive applications
    INSERT INTO applications_archive (
        id, job_id, candidate_id, status, current_phase_id,
        applied_at, updated_at, archive_reason, retention_until
    )
    SELECT 
        id, job_id, candidate_id, status, current_phase_id,
        applied_at, updated_at,
        CASE 
            WHEN status = 'rejected' THEN 'rejected'
            WHEN status = 'withdrawn' THEN 'withdrawn'
            WHEN status = 'accepted' THEN 'completed'
            ELSE 'expired'
        END,
        DATE_ADD(CURRENT_DATE, INTERVAL p_retention_years YEAR)
    FROM applications
    WHERE status IN ('rejected', 'withdrawn', 'accepted')
      AND updated_at < DATE_SUB(NOW(), INTERVAL p_months_old MONTH)
      AND id NOT IN (SELECT id FROM applications_archive);
    
    SET v_count = ROW_COUNT();
    
    -- Archive related application_phases
    INSERT INTO application_phases_archive
    SELECT ap.*, NOW()
    FROM application_phases ap
    INNER JOIN applications_archive aa ON ap.application_id = aa.id
    WHERE ap.id NOT IN (SELECT id FROM application_phases_archive);
    
    -- Delete from live tables (phases first due to FK)
    DELETE ap FROM application_phases ap
    INNER JOIN applications_archive aa ON ap.application_id = aa.id;
    
    DELETE FROM applications
    WHERE id IN (SELECT id FROM applications_archive);
    
    -- Log the operation
    SET v_execution_ms = TIMESTAMPDIFF(MICROSECOND, v_start_time, NOW()) / 1000;
    
    INSERT INTO archive_log (table_name, records_archived, archive_criteria, execution_time_ms)
    VALUES ('applications', v_count, 
            CONCAT('status IN (rejected, withdrawn, accepted) AND older than ', p_months_old, ' months'),
            v_execution_ms);
    
    COMMIT;
    
    SELECT v_count AS archived_count;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Archive Old Interviews
-- Archives interviews completed more than 6 months ago
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_archive_interviews(
    IN p_months_old INT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_start_time DATETIME;
    
    SET v_start_time = NOW();
    
    START TRANSACTION;
    
    -- Archive interview participants first
    INSERT INTO interview_participants_archive
    SELECT ip.*, NOW()
    FROM interview_participants ip
    INNER JOIN interviews i ON ip.interview_id = i.id
    WHERE i.status IN ('completed', 'cancelled', 'no_show')
      AND i.scheduled_at < DATE_SUB(NOW(), INTERVAL p_months_old MONTH)
      AND ip.id NOT IN (SELECT id FROM interview_participants_archive);
    
    -- Archive interviews
    INSERT INTO interviews_archive
    SELECT i.*, NOW()
    FROM interviews i
    WHERE i.status IN ('completed', 'cancelled', 'no_show')
      AND i.scheduled_at < DATE_SUB(NOW(), INTERVAL p_months_old MONTH)
      AND i.id NOT IN (SELECT id FROM interviews_archive);
    
    SET v_count = ROW_COUNT();
    
    -- Delete from live tables
    DELETE ip FROM interview_participants ip
    INNER JOIN interviews_archive ia ON ip.interview_id = ia.id;
    
    DELETE FROM interviews
    WHERE id IN (SELECT id FROM interviews_archive);
    
    INSERT INTO archive_log (table_name, records_archived, archive_criteria, 
                            execution_time_ms)
    VALUES ('interviews', v_count, 
            CONCAT('completed/cancelled older than ', p_months_old, ' months'),
            TIMESTAMPDIFF(MICROSECOND, v_start_time, NOW()) / 1000);
    
    COMMIT;
    
    SELECT v_count AS archived_count;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Archive Old Notifications
-- Archives notifications older than 90 days
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_archive_notifications(
    IN p_days_old INT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_start_time DATETIME;
    
    SET v_start_time = NOW();
    
    START TRANSACTION;
    
    -- Archive notifications
    INSERT INTO notifications_archive
    SELECT n.*, NOW()
    FROM notifications n
    WHERE n.created_at < DATE_SUB(NOW(), INTERVAL p_days_old DAY)
      AND n.id NOT IN (SELECT id FROM notifications_archive);
    
    SET v_count = ROW_COUNT();
    
    -- Delete from live table
    DELETE FROM notifications
    WHERE id IN (SELECT id FROM notifications_archive);
    
    INSERT INTO archive_log (table_name, records_archived, archive_criteria,
                            execution_time_ms)
    VALUES ('notifications', v_count, 
            CONCAT('older than ', p_days_old, ' days'),
            TIMESTAMPDIFF(MICROSECOND, v_start_time, NOW()) / 1000);
    
    COMMIT;
    
    SELECT v_count AS archived_count;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Archive Old Test Submissions
-- Archives test submissions for archived applications
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_archive_test_submissions()
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_start_time DATETIME;
    
    SET v_start_time = NOW();
    
    START TRANSACTION;
    
    -- Archive QCM answers first
    INSERT INTO qcm_answers_archive
    SELECT qa.*, NOW()
    FROM qcm_answers qa
    INNER JOIN test_submissions ts ON qa.submission_id = ts.id
    INNER JOIN application_phases_archive apa ON ts.application_phase_id = apa.id
    WHERE qa.id NOT IN (SELECT id FROM qcm_answers_archive);
    
    -- Archive code submissions
    INSERT INTO code_submissions_archive
    SELECT cs.*, NOW()
    FROM code_submissions cs
    INNER JOIN test_submissions ts ON cs.submission_id = ts.id
    INNER JOIN application_phases_archive apa ON ts.application_phase_id = apa.id
    WHERE cs.id NOT IN (SELECT id FROM code_submissions_archive);
    
    -- Archive test submissions
    INSERT INTO test_submissions_archive
    SELECT ts.*, NOW()
    FROM test_submissions ts
    INNER JOIN application_phases_archive apa ON ts.application_phase_id = apa.id
    WHERE ts.id NOT IN (SELECT id FROM test_submissions_archive);
    
    SET v_count = ROW_COUNT();
    
    -- Delete from live tables
    DELETE qa FROM qcm_answers qa
    INNER JOIN test_submissions_archive tsa ON qa.submission_id = tsa.id;
    
    DELETE cs FROM code_submissions cs
    INNER JOIN test_submissions_archive tsa ON cs.submission_id = tsa.id;
    
    DELETE FROM test_submissions
    WHERE id IN (SELECT id FROM test_submissions_archive);
    
    INSERT INTO archive_log (table_name, records_archived, archive_criteria,
                            execution_time_ms)
    VALUES ('test_submissions', v_count, 'linked to archived applications',
            TIMESTAMPDIFF(MICROSECOND, v_start_time, NOW()) / 1000);
    
    COMMIT;
    
    SELECT v_count AS archived_count;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Archive Old Offers
-- Archives offers that are declined/expired for more than 1 year
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_archive_offers(
    IN p_months_old INT,
    IN p_retention_years INT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_start_time DATETIME;
    
    SET v_start_time = NOW();
    
    START TRANSACTION;
    
    INSERT INTO offers_archive (
        id, application_id, title, department, salary, salary_currency,
        bonus, equity, start_date, benefits, additional_terms, status,
        sent_at, expires_at, responded_at, response_notes, retention_until
    )
    SELECT 
        id, application_id, title, department, salary, salary_currency,
        bonus, equity, start_date, benefits, additional_terms, status,
        sent_at, expires_at, responded_at, response_notes,
        DATE_ADD(CURRENT_DATE, INTERVAL p_retention_years YEAR)
    FROM offers
    WHERE status IN ('declined', 'expired')
      AND COALESCE(responded_at, expires_at, sent_at) < DATE_SUB(NOW(), INTERVAL p_months_old MONTH)
      AND id NOT IN (SELECT id FROM offers_archive);
    
    SET v_count = ROW_COUNT();
    
    DELETE FROM offers
    WHERE id IN (SELECT id FROM offers_archive);
    
    INSERT INTO archive_log (table_name, records_archived, archive_criteria,
                            execution_time_ms)
    VALUES ('offers', v_count, 
            CONCAT('declined/expired older than ', p_months_old, ' months'),
            TIMESTAMPDIFF(MICROSECOND, v_start_time, NOW()) / 1000);
    
    COMMIT;
    
    SELECT v_count AS archived_count;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Archive Closed Jobs
-- Archives jobs closed for more than 6 months
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_archive_jobs(
    IN p_months_old INT,
    IN p_retention_years INT
)
BEGIN
    DECLARE v_count INT DEFAULT 0;
    DECLARE v_start_time DATETIME;
    
    SET v_start_time = NOW();
    
    START TRANSACTION;
    
    INSERT INTO jobs_archive (
        id, title, department, description, requirements, location,
        is_remote, employment_type, salary_min, salary_max, salary_currency,
        status, created_by, created_at, updated_at, closed_at, retention_until
    )
    SELECT 
        id, title, department, description, requirements, location,
        is_remote, employment_type, salary_min, salary_max, salary_currency,
        status, created_by, created_at, updated_at, closed_at,
        DATE_ADD(CURRENT_DATE, INTERVAL p_retention_years YEAR)
    FROM jobs
    WHERE status IN ('closed', 'archived')
      AND closed_at < DATE_SUB(NOW(), INTERVAL p_months_old MONTH)
      AND id NOT IN (SELECT id FROM jobs_archive)
      -- Only archive if all applications are archived
      AND id NOT IN (SELECT DISTINCT job_id FROM applications);
    
    SET v_count = ROW_COUNT();
    
    DELETE FROM jobs
    WHERE id IN (SELECT id FROM jobs_archive);
    
    INSERT INTO archive_log (table_name, records_archived, archive_criteria,
                            execution_time_ms)
    VALUES ('jobs', v_count, 
            CONCAT('closed older than ', p_months_old, ' months with no active applications'),
            TIMESTAMPDIFF(MICROSECOND, v_start_time, NOW()) / 1000);
    
    COMMIT;
    
    SELECT v_count AS archived_count;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Purge Expired Archives (GDPR Compliance)
-- Permanently deletes archives past retention date
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_purge_expired_archives()
BEGIN
    DECLARE v_apps_count INT DEFAULT 0;
    DECLARE v_jobs_count INT DEFAULT 0;
    DECLARE v_offers_count INT DEFAULT 0;
    
    START TRANSACTION;
    
    -- Purge expired applications and related data
    DELETE FROM qcm_answers_archive 
    WHERE submission_id IN (
        SELECT tsa.id FROM test_submissions_archive tsa
        INNER JOIN application_phases_archive apa ON tsa.application_phase_id = apa.id
        INNER JOIN applications_archive aa ON apa.application_id = aa.id
        WHERE aa.retention_until < CURRENT_DATE
    );
    
    DELETE FROM code_submissions_archive 
    WHERE submission_id IN (
        SELECT tsa.id FROM test_submissions_archive tsa
        INNER JOIN application_phases_archive apa ON tsa.application_phase_id = apa.id
        INNER JOIN applications_archive aa ON apa.application_id = aa.id
        WHERE aa.retention_until < CURRENT_DATE
    );
    
    DELETE FROM test_submissions_archive 
    WHERE application_phase_id IN (
        SELECT apa.id FROM application_phases_archive apa
        INNER JOIN applications_archive aa ON apa.application_id = aa.id
        WHERE aa.retention_until < CURRENT_DATE
    );
    
    DELETE FROM application_phases_archive
    WHERE application_id IN (
        SELECT id FROM applications_archive WHERE retention_until < CURRENT_DATE
    );
    
    DELETE FROM applications_archive WHERE retention_until < CURRENT_DATE;
    SET v_apps_count = ROW_COUNT();
    
    -- Purge expired jobs
    DELETE FROM jobs_archive WHERE retention_until < CURRENT_DATE;
    SET v_jobs_count = ROW_COUNT();
    
    -- Purge expired offers
    DELETE FROM offers_archive WHERE retention_until < CURRENT_DATE;
    SET v_offers_count = ROW_COUNT();
    
    INSERT INTO archive_log (table_name, records_purged, archive_criteria)
    VALUES ('ALL_ARCHIVES', v_apps_count + v_jobs_count + v_offers_count, 
            'retention_until < CURRENT_DATE');
    
    COMMIT;
    
    SELECT v_apps_count AS apps_purged, 
           v_jobs_count AS jobs_purged, 
           v_offers_count AS offers_purged;
END //

-- ----------------------------------------------------------------------------
-- PROCEDURE: Run All Archive Jobs (Master Procedure)
-- ----------------------------------------------------------------------------
CREATE PROCEDURE sp_run_all_archive_jobs()
BEGIN
    DECLARE v_error_message TEXT;
    
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        INSERT INTO archive_log (table_name, records_archived, status, error_message)
        VALUES ('MASTER_JOB', 0, 'failed', v_error_message);
        ROLLBACK;
    END;
    
    -- Archive in dependency order
    CALL sp_archive_applications(6, 2);      -- 6 months old, retain 2 years
    CALL sp_archive_test_submissions();       -- Archives linked to archived apps
    CALL sp_archive_interviews(6);            -- 6 months old
    CALL sp_archive_offers(12, 3);            -- 12 months old, retain 3 years
    CALL sp_archive_notifications(90);        -- 90 days old
    CALL sp_archive_jobs(6, 2);               -- 6 months old, retain 2 years
    
    -- Purge expired archives
    CALL sp_purge_expired_archives();
    
    INSERT INTO archive_log (table_name, records_archived, status)
    VALUES ('MASTER_JOB', 0, 'success');
    
    SELECT 'All archive jobs completed successfully' AS result;
END //

DELIMITER ;

-- ----------------------------------------------------------------------------
-- Create MySQL Event for Nightly Archiving
-- ----------------------------------------------------------------------------
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS evt_nightly_archive
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 2 HOUR)  -- Run at 2 AM
DO
    CALL sp_run_all_archive_jobs();
