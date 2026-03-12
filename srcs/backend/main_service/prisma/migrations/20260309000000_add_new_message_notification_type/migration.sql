-- AlterTable: add newMessage value to Notification type enum
ALTER TABLE `Notification` MODIFY COLUMN `type` ENUM('applicationReceived','phaseStarted','testCompleted','interviewScheduled','accepted','rejected','offerSent','offerResponse','newMessage') NOT NULL;
