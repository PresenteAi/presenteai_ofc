-- Migration Script: UUID to Integer Auto-increment IDs
-- WARNING: This will DROP all existing data
-- Run this script to complete the migration from UUID strings to integer auto-increment IDs
-- MySQL Version

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables (this will remove all data)
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS user;

-- Recreate User table with integer auto-increment ID
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    lastLoginAt DATETIME NULL,
    indicatedById INT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (indicatedById) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Recreate Event table with integer auto-increment ID and integer userId foreign key
CREATE TABLE event (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    eventType ENUM('birthday', 'wedding', 'graduation', 'baby_shower', 'other') NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NULL,
    isPublished BOOLEAN NOT NULL DEFAULT FALSE,
    isActive BOOLEAN NOT NULL DEFAULT TRUE,
    publicUrl VARCHAR(255) UNIQUE,
    slug VARCHAR(255),
    coverImageUrl VARCHAR(500),
    primaryColor VARCHAR(7) DEFAULT '#FF6B6B',
    secondaryColor VARCHAR(7) DEFAULT '#4ECDC4',
    tertiaryColor VARCHAR(7) DEFAULT '#45B7D1',
    fontFamily VARCHAR(100) DEFAULT 'Inter',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create indexes for better performance
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_isActive ON user(isActive);
CREATE INDEX idx_event_userId ON event(userId);
CREATE INDEX idx_event_isActive ON event(isActive);
CREATE INDEX idx_event_isPublished ON event(isPublished);
CREATE INDEX idx_event_publicUrl ON event(publicUrl);
CREATE INDEX idx_event_startDate ON event(startDate);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;