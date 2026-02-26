CREATE TABLE `playbookShareTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roadmapId` int NOT NULL,
	`playbookType` varchar(50) NOT NULL,
	`token` varchar(32) NOT NULL,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playbookShareTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `playbookShareTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `taskProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roadmapId` int NOT NULL,
	`playbookType` varchar(50) NOT NULL,
	`taskId` varchar(255) NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `taskProgress_id` PRIMARY KEY(`id`)
);
