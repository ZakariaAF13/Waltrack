-- Waltrack Database Schema for Profile Features
-- PostgreSQL

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    pin_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget plans table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monthly_budget DECIMAL(15, 2) NOT NULL,
    savings_goal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Transactions table (for expense analysis)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active sessions table (for logout management)
CREATE TABLE active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Token blacklist table (for logout)
CREATE TABLE token_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(500) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blacklisted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX idx_active_sessions_expires_at ON active_sessions(expires_at);
CREATE INDEX idx_token_blacklist_token ON token_blacklist(token);
CREATE INDEX idx_token_blacklist_expires_at ON token_blacklist(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM token_blacklist WHERE expires_at < NOW();
    DELETE FROM active_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO users (name, email, pin_hash) VALUES
('User Waltrack', 'user@waltrack.app', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789');

INSERT INTO budgets (user_id, monthly_budget, savings_goal) VALUES
((SELECT id FROM users WHERE email = 'user@waltrack.app'), 10000000, 3000000);

INSERT INTO transactions (user_id, type, amount, category, description, date) VALUES
((SELECT id FROM users WHERE email = 'user@waltrack.app'), 'expense', 150000, 'Makanan', 'Makan siang', '2025-01-15'),
((SELECT id FROM users WHERE email = 'user@waltrack.app'), 'expense', 50000, 'Transport', 'Grab', '2025-01-15'),
((SELECT id FROM users WHERE email = 'user@waltrack.app'), 'income', 5000000, 'Gaji', 'Gaji bulanan', '2025-01-01');

-- Views for analytics
CREATE VIEW expense_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    SUM(amount) as total_expense,
    AVG(amount) as avg_expense,
    COUNT(*) as transaction_count
FROM transactions
WHERE type = 'expense'
GROUP BY user_id, DATE_TRUNC('month', date);

CREATE VIEW category_breakdown AS
SELECT 
    user_id,
    category,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count,
    ROUND((SUM(amount) * 100.0 / SUM(SUM(amount)) OVER (PARTITION BY user_id)), 2) as percentage
FROM transactions
WHERE type = 'expense'
GROUP BY user_id, category;
