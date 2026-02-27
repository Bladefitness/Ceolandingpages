CREATE TABLE `funnelEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(100) NOT NULL,
	`eventType` enum('page_view','checkout_start','purchase','upsell_view','upsell_accept','upsell_decline','downsell_view','downsell_accept','downsell_decline') NOT NULL,
	`pageSlug` varchar(100) NOT NULL,
	`orderId` int,
	`splitTestVariant` varchar(100),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `funnelEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funnelPageContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pageSlug` varchar(100) NOT NULL,
	`headline` text,
	`subheadline` text,
	`bodyText` text,
	`ctaText` varchar(255),
	`declineText` varchar(255),
	`originalPrice` int,
	`salePrice` int,
	`valueStackItems` text,
	`faqItems` text,
	`heroImageUrl` varchar(500),
	`videoUrl` varchar(500),
	`senjaWidgetId` varchar(255),
	`isActive` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `funnelPageContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `funnelPageContent_pageSlug_unique` UNIQUE(`pageSlug`)
);
--> statement-breakpoint
CREATE TABLE `splitTests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`pageSlug` varchar(100) NOT NULL,
	`splitTestStatus` enum('draft','running','completed') NOT NULL DEFAULT 'draft',
	`variants` text NOT NULL,
	`winnerVariantId` varchar(100),
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `splitTests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `installmentCount` int;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `installmentAmountInCents` int;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `installmentIntervalDays` int DEFAULT 30;
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `whopPlanId` varchar(255);
--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `metadata` text;
