-- Trimly Survey Database Schema
-- Created for Aiven MySQL Database

-- Table for customer survey responses
CREATE TABLE IF NOT EXISTS customer_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    domicile VARCHAR(255) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    problems TEXT NOT NULL,
    interest VARCHAR(100) NOT NULL,
    features TEXT NOT NULL,
    booking_fee VARCHAR(100) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    channel VARCHAR(100) NOT NULL,
    review_importance VARCHAR(100) NOT NULL,
    suggestions TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_domicile (domicile),
    INDEX idx_age (age),
    INDEX idx_gender (gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for barber/salon business survey responses
CREATE TABLE IF NOT EXISTS barber_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    years_operating VARCHAR(100) NOT NULL,
    number_of_barbers VARCHAR(100) NOT NULL,
    customer_methods TEXT NOT NULL,
    challenges TEXT NOT NULL,
    customer_source VARCHAR(255) NOT NULL,
    app_interest VARCHAR(100) NOT NULL,
    commission_agreement VARCHAR(100) NOT NULL,
    commission_rate VARCHAR(50) NOT NULL,
    partnership VARCHAR(100) NOT NULL,
    features TEXT NOT NULL,
    notification VARCHAR(255) NOT NULL,
    payment_methods TEXT NOT NULL,
    suggestions TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_location (location),
    INDEX idx_years (years_operating),
    INDEX idx_commission_rate (commission_rate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for admin users
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: trimly2025)
INSERT INTO admin_users (username, password) 
VALUES ('admin', 'trimly2025')
ON DUPLICATE KEY UPDATE username=username;
