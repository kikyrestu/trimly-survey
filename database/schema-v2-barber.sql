-- Trimly Survey Database Schema V2 - BARBER
-- Updated for redesigned barber survey (18 questions)

-- Drop and recreate barber_responses table with new structure
DROP TABLE IF EXISTS barber_responses;

CREATE TABLE barber_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Bagian 1: Profil Usaha  
    business_name VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    location_other VARCHAR(255),
    years_operating VARCHAR(100) NOT NULL,
    number_of_barbers VARCHAR(100) NOT NULL,
    customers_per_day VARCHAR(100) NOT NULL,
    
    -- Bagian 2: Sistem Operasional & Masalah Umum
    customer_arrival_method TEXT NOT NULL, -- JSON array or comma-separated
    common_problems TEXT NOT NULL, -- JSON array or comma-separated  
    customer_source VARCHAR(255) NOT NULL,
    customer_source_other VARCHAR(255),
    
    -- Bagian 3: Solusi Booking Digital
    interest_no_monthly_fee VARCHAR(50) NOT NULL,
    importance_schedule VARCHAR(50) NOT NULL,
    importance_wait_anywhere VARCHAR(50) NOT NULL,
    importance_queue_app VARCHAR(50) NOT NULL,
    want_auto_notification VARCHAR(50) NOT NULL,
    
    -- Bagian 4: Promosi & Pertumbuhan Usaha
    willing_partnership_promo VARCHAR(50) NOT NULL,
    important_promo_features TEXT NOT NULL, -- JSON array or comma-separated (max 2)
    
    -- Bagian 5: Pendapat Usaha
    biggest_challenge TEXT NOT NULL,
    must_have_features TEXT NOT NULL,
    willing_try_trimly VARCHAR(50) NOT NULL,
    
    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_timestamp (timestamp),
    INDEX idx_location (location),
    INDEX idx_years (years_operating),
    INDEX idx_willing_try_trimly (willing_try_trimly)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customerapon table remains with schema-v2.sql structure
