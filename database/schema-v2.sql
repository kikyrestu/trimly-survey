-- Trimly Survey Database Schema V2
-- Updated for redesigned customer survey (18 questions)

-- Drop and recreate customer_responses table with new structure
DROP TABLE IF EXISTS customer_responses;

CREATE TABLE customer_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Bagian 1: Profil
    age VARCHAR(50) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    domicile VARCHAR(255) NOT NULL,
    domicile_other VARCHAR(255),
    haircut_frequency VARCHAR(100) NOT NULL,
    
    -- Bagian 2: Kebiasaan Potong Rambut
    barbershop_choice VARCHAR(255) NOT NULL,
    important_factors TEXT NOT NULL, -- JSON array or comma-separated (max 3)
    when_full VARCHAR(255) NOT NULL,
    
    -- Bagian 3: Pain Awareness (skala 1-5)
    pain_wa_response VARCHAR(10) NOT NULL,
    pain_time_confusion VARCHAR(10) NOT NULL,
    pain_still_wait VARCHAR(10) NOT NULL,
    pain_queue_overlap VARCHAR(10) NOT NULL,
    pain_barber_forget VARCHAR(10) NOT NULL,
    pain_unknown_barber VARCHAR(10) NOT NULL,
    
    -- Bagian 4: Minat Booking Online
    interest_wait_anywhere VARCHAR(50) NOT NULL,
    interest_choose_barber VARCHAR(50) NOT NULL,
    interest_queue_time VARCHAR(50) NOT NULL,
    interest_notification VARCHAR(50) NOT NULL,
    
    -- Bagian 5: Promo & Keuntungan
    promo_types TEXT NOT NULL, -- JSON array or comma-separated (max 2)
    will_download_for_promo VARCHAR(50) NOT NULL,
    want_comparison_app VARCHAR(50) NOT NULL,
    
    -- Bagian 6: Pendapat
    wa_booking_issue TEXT,
    important_features TEXT,
    will_try_trimly VARCHAR(50) NOT NULL,
    
    -- Metadata
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_timestamp (timestamp),
    INDEX idx_domicile (domicile),
    INDEX idx_age (age),
    INDEX idx_gender (gender),
    INDEX idx_barbershop_choice (barbershop_choice),
    INDEX idx_will_try_trimly (will_try_trimly)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Keep barber_responses and admin_users tables as-is (no changes needed)
