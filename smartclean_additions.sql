USE smartclean;

CREATE TABLE IF NOT EXISTS password_resets (
    reset_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    user_type ENUM('citizen','worker','admin') NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_email (email),
    INDEX idx_reset_expiry (expires_at)
);


-- Admin address support used by the Admin registration/profile forms.
ALTER TABLE admins ADD COLUMN IF NOT EXISTS address VARCHAR(255);
