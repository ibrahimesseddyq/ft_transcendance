-- AlterTable: add contract_end_date to applications so recruiters can track when each employee contract expires
ALTER TABLE `applications` ADD COLUMN `contract_end_date` DATE NULL;
