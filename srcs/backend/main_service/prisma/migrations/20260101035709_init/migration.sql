-- CreateTable
CREATE TABLE `application_phases` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `application_id` CHAR(36) NOT NULL,
    `phase_id` CHAR(36) NOT NULL,
    `status` VARCHAR(20) NULL DEFAULT 'pending',
    `started_at` TIMESTAMP(0) NULL,
    `completed_at` TIMESTAMP(0) NULL,
    `notes` TEXT NULL,
    `score` INTEGER NULL,

    INDEX `idx_application_phases_status`(`application_id`, `status`),
    INDEX `phase_id`(`phase_id`),
    UNIQUE INDEX `unique_app_phase`(`application_id`, `phase_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applications` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `job_id` CHAR(36) NOT NULL,
    `candidate_id` CHAR(36) NOT NULL,
    `status` ENUM('pending', 'in_progress', 'accepted', 'rejected', 'withdrawn') NULL DEFAULT 'pending',
    `current_phase_id` CHAR(36) NULL,
    `applied_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `current_phase_id`(`current_phase_id`),
    INDEX `idx_applications_candidate`(`candidate_id`),
    INDEX `idx_applications_job`(`job_id`),
    INDEX `idx_applications_status`(`status`),
    UNIQUE INDEX `unique_application`(`job_id`, `candidate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `candidate_profiles` (
    `user_id` CHAR(36) NOT NULL,
    `resume_url` TEXT NULL,
    `linkedin_url` VARCHAR(255) NULL,
    `portfolio_url` VARCHAR(255) NULL,
    `current_company` VARCHAR(255) NULL,
    `current_title` VARCHAR(255) NULL,
    `years_experience` INTEGER NULL,
    `skills` LONGTEXT NULL,
    `preferred_locations` LONGTEXT NULL,
    `salary_expectation` VARCHAR(50) NULL,
    `available_from` DATE NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interview_participants` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `interview_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role` VARCHAR(50) NULL,
    `joined_at` TIMESTAMP(0) NULL,
    `left_at` TIMESTAMP(0) NULL,

    INDEX `user_id`(`user_id`),
    UNIQUE INDEX `unique_participant`(`interview_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `interviews` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `application_phase_id` CHAR(36) NOT NULL,
    `scheduled_at` TIMESTAMP(0) NOT NULL,
    `duration_minutes` INTEGER NULL DEFAULT 60,
    `interview_mode` ENUM('online', 'onsite') NOT NULL,
    `location` VARCHAR(255) NULL,
    `whiteboard_session_id` CHAR(36) NULL,
    `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') NULL DEFAULT 'scheduled',
    `started_at` TIMESTAMP(0) NULL,
    `ended_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `application_phase_id`(`application_phase_id`),
    INDEX `idx_interviews_scheduled`(`scheduled_at`, `status`),
    INDEX `idx_interviews_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_phases` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `job_id` CHAR(36) NOT NULL,
    `phase_type` ENUM('test', 'interview') NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `order_index` INTEGER NOT NULL,
    `is_required` BOOLEAN NULL DEFAULT true,
    `duration_minutes` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_job_order`(`job_id`, `order_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `title` VARCHAR(255) NOT NULL,
    `department` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `requirements` LONGTEXT NULL,
    `location` VARCHAR(255) NULL,
    `is_remote` BOOLEAN NULL DEFAULT false,
    `employment_type` VARCHAR(50) NULL,
    `salary_min` INTEGER NULL,
    `salary_max` INTEGER NULL,
    `salary_currency` VARCHAR(3) NULL DEFAULT 'USD',
    `status` ENUM('open', 'closed', 'archived') NULL DEFAULT 'open',
    `created_by` CHAR(36) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `closed_at` TIMESTAMP(0) NULL,

    INDEX `created_by`(`created_by`),
    INDEX `idx_jobs_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `user_id` CHAR(36) NOT NULL,
    `type` ENUM('application_received', 'phase_started', 'test_completed', 'interview_scheduled', 'accepted', 'rejected', 'offer_sent', 'offer_response') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NULL,
    `reference_type` VARCHAR(50) NULL,
    `reference_id` CHAR(36) NULL,
    `is_read` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_notifications_user_unread`(`user_id`, `is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offers` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `application_id` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `department` VARCHAR(100) NULL,
    `salary` INTEGER NOT NULL,
    `salary_currency` VARCHAR(3) NULL DEFAULT 'USD',
    `bonus` INTEGER NULL,
    `equity` VARCHAR(100) NULL,
    `start_date` DATE NULL,
    `benefits` TEXT NULL,
    `additional_terms` TEXT NULL,
    `status` ENUM('pending', 'accepted', 'declined', 'expired') NULL DEFAULT 'pending',
    `sent_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` TIMESTAMP(0) NULL,
    `responded_at` TIMESTAMP(0) NULL,
    `response_notes` TEXT NULL,

    UNIQUE INDEX `application_id`(`application_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phase_interviews` (
    `phase_id` CHAR(36) NOT NULL,
    `interview_mode` ENUM('online', 'onsite') NOT NULL,
    `location` VARCHAR(255) NULL,
    `has_whiteboard` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`phase_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phase_tests` (
    `phase_id` CHAR(36) NOT NULL,
    `test_id` CHAR(36) NOT NULL,

    PRIMARY KEY (`phase_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL DEFAULT (uuid()),
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('candidate', 'recruiter', 'admin') NOT NULL DEFAULT 'candidate',
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `avatar_url` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `application_phases` ADD CONSTRAINT `application_phases_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `application_phases` ADD CONSTRAINT `application_phases_ibfk_2` FOREIGN KEY (`phase_id`) REFERENCES `job_phases`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`current_phase_id`) REFERENCES `job_phases`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `candidate_profiles` ADD CONSTRAINT `candidate_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `interview_participants` ADD CONSTRAINT `interview_participants_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interviews`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `interview_participants` ADD CONSTRAINT `interview_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `interviews` ADD CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`application_phase_id`) REFERENCES `application_phases`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `job_phases` ADD CONSTRAINT `job_phases_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `phase_interviews` ADD CONSTRAINT `phase_interviews_ibfk_1` FOREIGN KEY (`phase_id`) REFERENCES `job_phases`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `phase_tests` ADD CONSTRAINT `phase_tests_ibfk_1` FOREIGN KEY (`phase_id`) REFERENCES `job_phases`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
