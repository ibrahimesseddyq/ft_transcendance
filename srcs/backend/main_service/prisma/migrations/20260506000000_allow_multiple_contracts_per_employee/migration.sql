-- DropIndex: allow an employee to have multiple contracts (applications) for the same job.
-- Active-duplicate prevention is now handled at the application layer.
ALTER TABLE `applications` DROP INDEX `unique_application`;

-- CreateIndex: non-unique index to keep query performance on (job_id, candidate_id) lookups
CREATE INDEX `idx_applications_job_candidate` ON `applications`(`job_id`, `candidate_id`);
