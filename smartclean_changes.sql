USE smartclean;

-- ============================================================
-- 1. ADD STREET NAME AND WARD NUMBER TO WORKERS
-- ============================================================

ALTER TABLE workers
ADD COLUMN street_name VARCHAR(100) NULL;

ALTER TABLE workers
ADD COLUMN ward_number INT NULL;


-- ============================================================
-- 2. RESOLUTION REQUESTS
-- ============================================================

CREATE TABLE IF NOT EXISTS resolution_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,

    complaint_id INT NOT NULL,
    worker_id INT NOT NULL,

    resolved_photo_path VARCHAR(255) NOT NULL,
    resolved_date DATE NOT NULL,

    request_status VARCHAR(20) DEFAULT 'Pending',

    admin_id INT NULL,
    admin_remarks TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP NULL,

    FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id),

    FOREIGN KEY (worker_id)
        REFERENCES workers(worker_id),

    FOREIGN KEY (admin_id)
        REFERENCES admins(admin_id)
);


-- ============================================================
-- 3. NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,

    recipient_role VARCHAR(20) NOT NULL,
    recipient_id INT NOT NULL,

    complaint_id INT NULL,

    notification_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id)
);


-- ============================================================
-- 4. COMPLAINT REVIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS complaint_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,

    complaint_id INT NOT NULL,
    citizen_id INT NOT NULL,

    review_text TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_complaint_review (complaint_id),

    FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id),

    FOREIGN KEY (citizen_id)
        REFERENCES citizens(citizen_id)
);