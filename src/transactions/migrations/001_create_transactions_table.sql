-- Migration: Create transactions table
-- Description: Creates the transactions table to track payment processing for contributions
-- Author: Sistema Presente Aí
-- Date: 2024

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contribution_id INT NOT NULL,
    payment_gateway ENUM('stripe', 'mercadopago', 'pagarme') NOT NULL,
    external_transaction_id VARCHAR(255) NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    status ENUM('initiated', 'processing', 'paid', 'failed', 'refunded') DEFAULT 'initiated',
    payment_date DATETIME NULL,
    refund_date DATETIME NULL,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_transactions_contribution_id 
        FOREIGN KEY (contribution_id) 
        REFERENCES contributions(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Unique constraint for external transaction ID
    CONSTRAINT uk_transactions_external_id 
        UNIQUE KEY (external_transaction_id),
    
    -- Index for performance optimization
    INDEX idx_transactions_contribution_id (contribution_id),
    INDEX idx_transactions_gateway_status (payment_gateway, status),
    INDEX idx_transactions_status_payment_date (status, payment_date),
    INDEX idx_transactions_created_at (created_at)
);

-- Trigger to automatically calculate net_amount before insert/update
DELIMITER //
CREATE TRIGGER tr_transactions_calculate_net_amount_insert
    BEFORE INSERT ON transactions
    FOR EACH ROW
BEGIN
    SET NEW.net_amount = NEW.amount - IFNULL(NEW.fee, 0);
END//

CREATE TRIGGER tr_transactions_calculate_net_amount_update
    BEFORE UPDATE ON transactions
    FOR EACH ROW
BEGIN
    SET NEW.net_amount = NEW.amount - IFNULL(NEW.fee, 0);
END//
DELIMITER ;

-- Add sample data for testing (optional - remove in production)
-- INSERT INTO transactions (
--     contribution_id, 
--     payment_gateway, 
--     external_transaction_id,
--     amount, 
--     fee, 
--     status,
--     payment_date,
--     metadata
-- ) VALUES 
-- (1, 'stripe', 'stripe_pi_test_123456', 50.00, 2.50, 'paid', NOW(), '{"gateway_fee": 1.50, "stripe_fee": 1.00}'),
-- (2, 'mercadopago', 'mp_pref_test_789012', 75.00, 3.75, 'processing', NULL, '{"mercadopago_id": "123456789"}'),
-- (3, 'pagarme', 'pagarme_tx_test_345678', 25.00, 1.25, 'failed', NULL, '{"error_code": "card_declined", "error_message": "Insufficient funds"}')