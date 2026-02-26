ALTER TABLE `roadmaps` ADD `shareCode` varchar(10);--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `viewCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD CONSTRAINT `roadmaps_shareCode_unique` UNIQUE(`shareCode`);