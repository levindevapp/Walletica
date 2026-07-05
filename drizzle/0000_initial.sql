CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `color` text DEFAULT '#13915a' NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);
--> statement-breakpoint

CREATE TABLE `subcategories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `category_id` integer NOT NULL,
  `name` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subcategories_category_name_unique` ON `subcategories` (`category_id`,`name`);
--> statement-breakpoint

CREATE TABLE `payment_methods` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_methods_name_unique` ON `payment_methods` (`name`);
--> statement-breakpoint

CREATE TABLE `expenses` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `spent_on` text NOT NULL,
  `amount` real NOT NULL,
  `category_id` integer NOT NULL,
  `subcategory_id` integer NOT NULL,
  `payment_method_id` integer NOT NULL,
  `merchant` text,
  `memo` text,
  `cost_type` text NOT NULL,
  `spending_type` text NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

CREATE TABLE `budgets` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `year_month` text NOT NULL,
  `category_id` integer,
  `subcategory_id` integer,
  `amount` real NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON UPDATE no action ON DELETE cascade
);
