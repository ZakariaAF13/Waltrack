# Waltrack Backend - Profile Features

Backend API implementation untuk semua fitur Profile di Waltrack.

## 🚀 Features

✅ **User Profile Management** - Edit nama dan email  
✅ **Expense Analysis** - Analisis pengeluaran dengan breakdown kategori  
✅ **Budget Planning** - Set budget bulanan dan target tabungan  
✅ **PIN Management** - Ubah PIN dengan validasi keamanan  
✅ **Logout** - Logout dari satu atau semua device  

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm atau yarn

## 🛠️ Installation

### 1. Clone dan Install Dependencies

```bash
cd backend-example
npm install
```

### 2. Setup Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE waltrack;

# Connect ke database
\c waltrack

# Run schema
\i database-schema.sql
```

### 3. Environment Variables

Buat file `.env`:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_URL=postgresql://postgres:password@localhost:5432/waltrack
NODE_ENV=development
```

### 4. Run Server

```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### Authentication
Semua endpoint memerlukan JWT token di header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. Profile Management

**Get Profile**
```http
GET /api/profile
```

**Update Profile**
```http
PUT /api/profile
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

### 2. Expense Analysis

**Get Analysis**
```http
GET /api/analytics/expenses?period=month&start_date=2025-01-01&end_date=2025-01-31
```

### 3. Budget Planning

**Get Budget**
```http
GET /api/budget
```

**Save Budget**
```http
POST /api/budget
Content-Type: application/json

{
  "monthly_budget": 10000000,
  "savings_goal": 3000000
}
```

### 4. PIN Management

**Verify PIN**
```http
POST /api/auth/verify-pin
Content-Type: application/json

{
  "pin": "1234"
}
```

**Change PIN**
```http
PUT /api/auth/change-pin
Content-Type: application/json

{
  "current_pin": "1234",
  "new_pin": "5678",
  "confirm_pin": "5678"
}
```

### 5. Logout

**Logout**
```http
POST /api/auth/logout
```

**Logout All Devices**
```http
POST /api/auth/logout-all
```

## 🔒 Security Features

- **JWT Authentication** - Semua endpoint protected
- **Bcrypt Hashing** - PIN di-hash dengan bcrypt (10 rounds)
- **Rate Limiting** - 5 attempts per minute untuk PIN operations
- **Token Blacklist** - Invalidate tokens saat logout
- **Input Validation** - Semua input divalidasi
- **SQL Injection Protection** - Parameterized queries

## 🧪 Testing

```bash
# Run tests
npm test

# Test dengan curl
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Database Schema

### Tables
- `users` - User profiles dan credentials
- `budgets` - Budget plans per user
- `transactions` - Transaction history
- `active_sessions` - Active JWT sessions
- `token_blacklist` - Invalidated tokens

### Views
- `expense_summary` - Monthly expense summary
- `category_breakdown` - Expense by category

## 🔄 Integration dengan Frontend

Frontend sudah terintegrasi dengan komponen-komponen berikut:

### Dialogs
- `ProfileEditDialog.tsx` - Edit profile
- `ExpenseAnalysisDialog.tsx` - View analytics
- `BudgetPlanDialog.tsx` - Set budget
- `ChangePinDialog.tsx` - Change PIN
- Logout confirmation dengan AlertDialog

### State Management
```typescript
// User state
const [userName, setUserName] = useState('User Waltrack');
const [userEmail, setUserEmail] = useState('user@waltrack.app');

// Dialog visibility
const [showProfileEdit, setShowProfileEdit] = useState(false);
const [showExpenseAnalysis, setShowExpenseAnalysis] = useState(false);
const [showBudgetPlan, setShowBudgetPlan] = useState(false);
const [showChangePin, setShowChangePin] = useState(false);
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
```

### API Calls Example

```typescript
// Update profile
const updateProfile = async (name: string, email: string) => {
  const response = await fetch('http://localhost:3000/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, email })
  });
  return response.json();
};

// Get expense analysis
const getExpenseAnalysis = async () => {
  const response = await fetch('http://localhost:3000/api/analytics/expenses?period=month', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Change PIN
const changePin = async (currentPin: string, newPin: string) => {
  const response = await fetch('http://localhost:3000/api/auth/change-pin', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      current_pin: currentPin,
      new_pin: newPin,
      confirm_pin: newPin
    })
  });
  return response.json();
};
```

## 📝 Error Handling

Semua error response mengikuti format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### Error Codes
- `UNAUTHORIZED` - Invalid/expired token
- `INVALID_PIN` - Wrong PIN
- `PIN_MISMATCH` - PIN confirmation doesn't match
- `INVALID_EMAIL` - Invalid email format
- `VALIDATION_ERROR` - Request validation failed
- `RATE_LIMIT` - Too many requests
- `SERVER_ERROR` - Internal server error

## 🚀 Deployment

### Heroku
```bash
heroku create waltrack-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Docker
```bash
docker build -t waltrack-backend .
docker run -p 3000:3000 waltrack-backend
```

### Environment Variables (Production)
```env
PORT=3000
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<production-database-url>
NODE_ENV=production
CORS_ORIGIN=https://waltrack.app
```

## 📚 Additional Resources

- [API Documentation](./PROFILE_API_DOCS.md)
- [Database Schema](./database-schema.sql)
- [Frontend Integration](../src/App.tsx)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Waltrack Team - 2025
