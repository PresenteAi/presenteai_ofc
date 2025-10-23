-- Migração para criar tabela de withdrawals (saques)
-- Data: 2023-12-25
-- Autor: Sistema de Saques PresenteAí

-- Criar tabela de withdrawals
CREATE TABLE withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    fee_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    status ENUM(
        'PENDING',
        'PROCESSING', 
        'COMPLETED',
        'FAILED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'PENDING',
    payment_gateway ENUM(
        'STRIPE',
        'MERCADOPAGO', 
        'PAGARME',
        'PIX',
        'BANK_TRANSFER'
    ) NOT NULL,
    bank_account JSON NOT NULL COMMENT 'Dados da conta bancária em formato JSON',
    transaction_reference VARCHAR(255) NULL COMMENT 'Referência da transação no gateway',
    failure_reason TEXT NULL COMMENT 'Motivo da falha se aplicável',
    fees DECIMAL(10, 2) NULL COMMENT 'Taxas cobradas pelo gateway',
    notes TEXT NULL COMMENT 'Observações administrativas',
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de solicitação',
    processed_at TIMESTAMP NULL COMMENT 'Data de processamento',
    completed_at TIMESTAMP NULL COMMENT 'Data de conclusão',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_withdrawal_amounts CHECK (
        total_amount > 0 AND 
        fee_amount >= 0 AND 
        net_amount >= 0 AND
        net_amount <= total_amount
    ),
    
    CONSTRAINT chk_withdrawal_dates CHECK (
        processed_at IS NULL OR processed_at >= requested_at
    ),
    
    CONSTRAINT chk_withdrawal_completed_date CHECK (
        completed_at IS NULL OR completed_at >= requested_at
    ),
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Índices para performance
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_gateway ON withdrawals(payment_gateway);
CREATE INDEX idx_withdrawals_requested_at ON withdrawals(requested_at);
CREATE INDEX idx_withdrawals_user_status ON withdrawals(user_id, status);
CREATE INDEX idx_withdrawals_status_requested ON withdrawals(status, requested_at);

-- Índice composto para consultas de relatórios admin
CREATE INDEX idx_withdrawals_admin_reports ON withdrawals(
    status, 
    payment_gateway, 
    requested_at
);

-- Índice para identificar saques em atraso
CREATE INDEX idx_withdrawals_overdue ON withdrawals(
    status, 
    requested_at
) WHERE status IN ('PENDING', 'PROCESSING');

-- Comentários na tabela
ALTER TABLE withdrawals COMMENT = 'Tabela para gerenciar solicitações de saque dos usuários';

-- Trigger para validar transições de status
DELIMITER $$

CREATE TRIGGER trg_withdrawal_status_validation 
BEFORE UPDATE ON withdrawals
FOR EACH ROW
BEGIN
    -- Validar transições de status
    IF OLD.status = 'COMPLETED' AND NEW.status != 'COMPLETED' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot change status from COMPLETED';
    END IF;
    
    IF OLD.status = 'CANCELLED' AND NEW.status != 'CANCELLED' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot change status from CANCELLED';
    END IF;
    
    -- Definir processed_at quando status muda para PROCESSING
    IF OLD.status != 'PROCESSING' AND NEW.status = 'PROCESSING' THEN
        SET NEW.processed_at = NOW();
    END IF;
    
    -- Definir completed_at quando status muda para COMPLETED
    IF OLD.status != 'COMPLETED' AND NEW.status = 'COMPLETED' THEN
        SET NEW.completed_at = NOW();
    END IF;
    
    -- Validar que transação de referência existe quando completado
    IF NEW.status = 'COMPLETED' AND (NEW.transaction_reference IS NULL OR NEW.transaction_reference = '') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Transaction reference is required for completed withdrawals';
    END IF;
END$$

DELIMITER ;

-- View para relatórios de withdrawal por usuário
CREATE VIEW v_user_withdrawal_summary AS
SELECT 
    w.user_id,
    u.email,
    u.name,
    COUNT(*) as total_withdrawals,
    SUM(w.total_amount) as total_requested,
    SUM(CASE WHEN w.status = 'COMPLETED' THEN w.net_amount ELSE 0 END) as total_paid,
    SUM(CASE WHEN w.status = 'PENDING' THEN w.total_amount ELSE 0 END) as pending_amount,
    SUM(CASE WHEN w.status = 'PROCESSING' THEN w.total_amount ELSE 0 END) as processing_amount,
    SUM(w.fee_amount) as total_fees,
    MIN(w.requested_at) as first_withdrawal,
    MAX(w.requested_at) as last_withdrawal,
    AVG(w.total_amount) as average_amount
FROM withdrawals w
JOIN users u ON w.user_id = u.id
GROUP BY w.user_id, u.email, u.name;

-- View para monitoramento de saques em atraso
CREATE VIEW v_overdue_withdrawals AS
SELECT 
    w.*,
    u.email,
    u.name,
    TIMESTAMPDIFF(HOUR, w.requested_at, NOW()) as hours_pending
FROM withdrawals w
JOIN users u ON w.user_id = u.id
WHERE w.status IN ('PENDING', 'PROCESSING')
AND TIMESTAMPDIFF(HOUR, w.requested_at, NOW()) > 24
ORDER BY w.requested_at ASC;

-- View para estatísticas diárias de withdrawals
CREATE VIEW v_daily_withdrawal_stats AS
SELECT 
    DATE(requested_at) as date,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_count,
    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'PROCESSING' THEN 1 END) as processing_count,
    COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_count,
    SUM(total_amount) as total_requested_amount,
    SUM(CASE WHEN status = 'COMPLETED' THEN net_amount ELSE 0 END) as total_paid_amount,
    SUM(fee_amount) as total_fees,
    AVG(total_amount) as average_amount
FROM withdrawals
GROUP BY DATE(requested_at)
ORDER BY date DESC;

-- Inserir dados de configuração de limites (se necessário)
-- Pode ser usado para armazenar configurações globais de withdrawal
CREATE TABLE IF NOT EXISTS withdrawal_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Configurações padrão de withdrawal
INSERT INTO withdrawal_settings (setting_key, setting_value, description) VALUES
('minimum_withdrawal_amount', '10.00', 'Valor mínimo para saque em BRL'),
('maximum_withdrawal_amount', '5000.00', 'Valor máximo para saque em BRL'),
('withdrawal_fee_percentage', '3.0', 'Percentual de taxa de saque'),
('withdrawal_processing_hours', '24', 'Horas máximas para processar saque'),
('daily_withdrawal_limit', '10000.00', 'Limite diário de saques por usuário em BRL'),
('monthly_withdrawal_limit', '50000.00', 'Limite mensal de saques por usuário em BRL');

COMMIT;