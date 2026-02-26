ALTER TABLE `roadmaps` MODIFY COLUMN `titanRoadmap` text;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `allAnswers` text;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `overallScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `operationsScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `marketingScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `salesScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `systemsScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `industryAverage` int DEFAULT 65 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `topPerformerScore` int DEFAULT 88 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `userPercentile` int DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `topStrength` varchar(255);--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `biggestGap` varchar(255);--> statement-breakpoint
ALTER TABLE `roadmaps` ADD `potentialRevenue` int DEFAULT 0 NOT NULL;