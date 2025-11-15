// Example Backend Implementation for Waltrack Profile Features
// Stack: Node.js + Express + PostgreSQL

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// Middleware: Verify JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' }
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
      });
    }
    req.user = user;
    next();
  });
};

// Rate limiting for PIN operations
const pinRateLimiter = new Map();
const checkPinRateLimit = (userId) => {
  const now = Date.now();
  const userAttempts = pinRateLimiter.get(userId) || [];
  const recentAttempts = userAttempts.filter(time => now - time < 60000);
  
  if (recentAttempts.length >= 5) {
    return false;
  }
  
  recentAttempts.push(now);
  pinRateLimiter.set(userId, recentAttempts);
  return true;
};

// ============================================
// 1. USER PROFILE ENDPOINTS
// ============================================

// GET /api/profile - Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // In real app, fetch from database
    // const user = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    
    const user = {
      id: req.user.id,
      name: 'User Waltrack',
      email: 'user@waltrack.app',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// PUT /api/profile - Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name and email are required' }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Invalid email format' }
      });
    }

    // In real app, update database
    // await db.query('UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3', 
    //   [name, email, req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: req.user.id,
        name,
        email,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// ============================================
// 2. EXPENSE ANALYSIS ENDPOINTS
// ============================================

// GET /api/analytics/expenses - Get expense analysis
app.get('/api/analytics/expenses', authenticateToken, async (req, res) => {
  try {
    const { period = 'month', start_date, end_date } = req.query;

    // In real app, calculate from transactions table
    // const analysis = await calculateExpenseAnalysis(req.user.id, period, start_date, end_date);

    const mockAnalysis = {
      total_expense: 5000000,
      average_expense: 250000,
      transaction_count: 20,
      period: {
        start: start_date || '2025-01-01',
        end: end_date || '2025-01-31'
      },
      category_breakdown: [
        { category: 'Makanan', amount: 2000000, percentage: 40, count: 8 },
        { category: 'Transport', amount: 1500000, percentage: 30, count: 6 },
        { category: 'Belanja', amount: 1000000, percentage: 20, count: 4 },
        { category: 'Hiburan', amount: 500000, percentage: 10, count: 2 }
      ],
      daily_trend: []
    };

    res.json({
      success: true,
      data: mockAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// ============================================
// 3. BUDGET PLANNING ENDPOINTS
// ============================================

// GET /api/budget - Get budget plan
app.get('/api/budget', authenticateToken, async (req, res) => {
  try {
    // In real app, fetch from budget table
    // const budget = await db.query('SELECT * FROM budgets WHERE user_id = $1', [req.user.id]);

    const mockBudget = {
      monthly_budget: 10000000,
      savings_goal: 3000000,
      current_spending: 5000000,
      remaining_budget: 5000000,
      budget_usage_percentage: 50,
      savings_progress: 2000000,
      savings_percentage: 66.67,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockBudget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// POST /api/budget - Create/Update budget plan
app.post('/api/budget', authenticateToken, async (req, res) => {
  try {
    const { monthly_budget, savings_goal } = req.body;

    // Validation
    if (!monthly_budget || !savings_goal) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Monthly budget and savings goal are required' }
      });
    }

    if (monthly_budget <= 0 || savings_goal <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_BUDGET', message: 'Budget amounts must be positive' }
      });
    }

    // In real app, insert or update database
    // await db.query(
    //   'INSERT INTO budgets (user_id, monthly_budget, savings_goal) VALUES ($1, $2, $3) ' +
    //   'ON CONFLICT (user_id) DO UPDATE SET monthly_budget = $2, savings_goal = $3, updated_at = NOW()',
    //   [req.user.id, monthly_budget, savings_goal]
    // );

    res.json({
      success: true,
      message: 'Budget plan saved successfully',
      data: {
        monthly_budget,
        savings_goal,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// ============================================
// 4. PIN MANAGEMENT ENDPOINTS
// ============================================

// POST /api/auth/verify-pin - Verify current PIN
app.post('/api/auth/verify-pin', authenticateToken, async (req, res) => {
  try {
    if (!checkPinRateLimit(req.user.id)) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMIT', message: 'Too many attempts. Please try again later.' }
      });
    }

    const { pin } = req.body;

    // In real app, fetch hashed PIN from database
    // const user = await db.query('SELECT pin_hash FROM users WHERE id = $1', [req.user.id]);
    // const isValid = await bcrypt.compare(pin, user.pin_hash);

    const mockPinHash = await bcrypt.hash('1234', SALT_ROUNDS);
    const isValid = await bcrypt.compare(pin, mockPinHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_PIN', message: 'PIN is incorrect' }
      });
    }

    res.json({
      success: true,
      message: 'PIN verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// PUT /api/auth/change-pin - Change PIN
app.put('/api/auth/change-pin', authenticateToken, async (req, res) => {
  try {
    if (!checkPinRateLimit(req.user.id)) {
      return res.status(429).json({
        success: false,
        error: { code: 'RATE_LIMIT', message: 'Too many attempts. Please try again later.' }
      });
    }

    const { current_pin, new_pin, confirm_pin } = req.body;

    // Validation
    if (!current_pin || !new_pin || !confirm_pin) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'All PIN fields are required' }
      });
    }

    if (new_pin.length < 4 || new_pin.length > 6) {
      return res.status(400).json({
        success: false,
        error: { code: 'PIN_LENGTH_ERROR', message: 'PIN must be 4-6 digits' }
      });
    }

    if (!/^\d+$/.test(new_pin)) {
      return res.status(400).json({
        success: false,
        error: { code: 'PIN_FORMAT_ERROR', message: 'PIN must contain only digits' }
      });
    }

    if (new_pin !== confirm_pin) {
      return res.status(400).json({
        success: false,
        error: { code: 'PIN_MISMATCH', message: 'New PIN and confirmation do not match' }
      });
    }

    // Verify current PIN
    // const user = await db.query('SELECT pin_hash FROM users WHERE id = $1', [req.user.id]);
    // const isValid = await bcrypt.compare(current_pin, user.pin_hash);

    const mockCurrentPinHash = await bcrypt.hash('1234', SALT_ROUNDS);
    const isValid = await bcrypt.compare(current_pin, mockCurrentPinHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_PIN', message: 'Current PIN is incorrect' }
      });
    }

    // Hash and save new PIN
    const newPinHash = await bcrypt.hash(new_pin, SALT_ROUNDS);
    // await db.query('UPDATE users SET pin_hash = $1, updated_at = NOW() WHERE id = $2', 
    //   [newPinHash, req.user.id]);

    res.json({
      success: true,
      message: 'PIN changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// ============================================
// 5. LOGOUT ENDPOINTS
// ============================================

// POST /api/auth/logout - Logout user
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    // In real app, invalidate token (add to blacklist or remove from whitelist)
    // await db.query('INSERT INTO token_blacklist (token, user_id) VALUES ($1, $2)', 
    //   [req.headers.authorization.split(' ')[1], req.user.id]);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// POST /api/auth/logout-all - Logout from all devices
app.post('/api/auth/logout-all', authenticateToken, async (req, res) => {
  try {
    // In real app, invalidate all tokens for this user
    // await db.query('DELETE FROM active_sessions WHERE user_id = $1', [req.user.id]);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Waltrack Backend running on port ${PORT}`);
});

module.exports = app;
