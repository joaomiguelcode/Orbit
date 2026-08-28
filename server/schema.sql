-- ==========================================================
-- Discord Full-Stack Database Schema for MariaDB / MySQL
-- Clean Zero-State Setup (Inspected in HeidiSQL)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `orbit_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `orbit_db`;

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS `voice_sessions`;
DROP TABLE IF EXISTS `reactions`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `direct_messages`;
DROP TABLE IF EXISTS `channels`;
DROP TABLE IF EXISTS `server_members`;
DROP TABLE IF EXISTS `servers`;
DROP TABLE IF EXISTS `friendships`;
DROP TABLE IF EXISTS `users`;

-- 1. USERS TABLE
CREATE TABLE `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `display_name` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `tag` VARCHAR(10) NOT NULL,
  `status` ENUM('online', 'idle', 'dnd', 'offline') DEFAULT 'online',
  `custom_status` VARCHAR(255) DEFAULT '',
  `avatar_color` VARCHAR(20) DEFAULT '#5865F2',
  `avatar_url` TEXT DEFAULT NULL,
  `banner_color` VARCHAR(20) DEFAULT '#5865F2',
  `bio` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SERVERS TABLE
CREATE TABLE `servers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `icon_url` TEXT DEFAULT NULL,
  `owner_id` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. SERVER MEMBERS TABLE
CREATE TABLE `server_members` (
  `id` VARCHAR(50) PRIMARY KEY,
  `server_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `role` ENUM('owner', 'admin', 'member') DEFAULT 'member',
  `nickname` VARCHAR(100) DEFAULT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_server_member` (`server_id`, `user_id`),
  FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CHANNELS TABLE
CREATE TABLE `channels` (
  `id` VARCHAR(50) PRIMARY KEY,
  `server_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `topic` VARCHAR(255) DEFAULT '',
  `type` ENUM('text', 'voice') DEFAULT 'text',
  `category` VARCHAR(50) DEFAULT 'TEXT CHANNELS',
  `position` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. MESSAGES TABLE
CREATE TABLE `messages` (
  `id` VARCHAR(50) PRIMARY KEY,
  `channel_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `text` TEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `attachment_name` VARCHAR(255) DEFAULT NULL,
  `attachment_type` VARCHAR(50) DEFAULT NULL,
  `is_pinned` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. REACTIONS TABLE
CREATE TABLE `reactions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `message_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `emoji` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_reaction` (`message_id`, `user_id`, `emoji`),
  FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. FRIENDSHIPS TABLE
CREATE TABLE `friendships` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id_1` VARCHAR(50) NOT NULL,
  `user_id_2` VARCHAR(50) NOT NULL,
  `status` ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  `requester_id` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_friendship` (`user_id_1`, `user_id_2`),
  FOREIGN KEY (`user_id_1`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id_2`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. DIRECT MESSAGES TABLE
CREATE TABLE `direct_messages` (
  `id` VARCHAR(50) PRIMARY KEY,
  `sender_id` VARCHAR(50) NOT NULL,
  `receiver_id` VARCHAR(50) NOT NULL,
  `text` TEXT NOT NULL,
  `attachment_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. VOICE SESSIONS TABLE
CREATE TABLE `voice_sessions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `channel_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `is_speaking` BOOLEAN DEFAULT FALSE,
  `is_muted` BOOLEAN DEFAULT FALSE,
  `is_deafened` BOOLEAN DEFAULT FALSE,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_voice` (`channel_id`, `user_id`),
  FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
