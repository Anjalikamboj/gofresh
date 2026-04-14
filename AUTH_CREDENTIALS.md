# GroFresh Authentication - Test Credentials

## Admin Account
- **Email:** admin@grofresh.com
- **Password:** admin123
- **Role:** admin
- **Access:** Full admin dashboard, inventory management, scheduler control

## Regular User Account
- **Email:** user@grofresh.com
- **Password:** user123
- **Role:** user
- **Access:** Browse products, create subscriptions, view orders

## Features Implemented

### Authentication System
- ✅ JWT-based authentication with 7-day token expiry
- ✅ Secure password hashing using bcrypt
- ✅ Persistent sessions (tokens stored in localStorage)
- ✅ Protected routes for authenticated users
- ✅ Admin-only routes for inventory management
- ✅ Automatic token validation and user loading

### Login Page (/login)
- Email and password input with icons
- Form validation
- Error handling with clear messages
- "Sign up" link for new users
- Responsive design for mobile/desktop
- Loading states

### Register Page (/register)
- Full name, email, password, confirm password fields
- Real-time password strength indicator (Weak/Medium/Strong)
- Password match validation with visual feedback
- Form validation (min 6 characters)
- Error handling
- "Sign in" link for existing users
- Responsive design

### Navigation Updates
- Shows "Sign in" and "Sign up" buttons when logged out
- Shows user name and "Logout" button when logged in
- Admin link only visible to admin users
- Protected pages redirect to login if not authenticated

### API Protection
- All subscription endpoints require authentication
- All order endpoints require authentication
- Admin endpoints (products, scheduler) require admin role
- JWT token sent in Authorization header

### Security Features
- Passwords hashed with bcrypt before storage
- JWT tokens with expiration
- Role-based access control (RBAC)
- Secure HTTP-only authentication
- No passwords returned in API responses

## Testing the Auth Flow

1. **Register a new account:**
   - Go to https://fresh-sub-1.preview.emergentagent.com/register
   - Fill in your details
   - Click "Create account"
   - You'll be automatically logged in and redirected to products

2. **Login with existing account:**
   - Go to https://fresh-sub-1.preview.emergentagent.com/login
   - Use one of the test credentials above
   - Click "Sign in"
   - You'll be redirected to products page

3. **Access protected features:**
   - Create subscriptions (requires login)
   - View your subscriptions (requires login)
   - View your orders (requires login)
   - Admin dashboard (requires admin role)

4. **Logout:**
   - Click the "Logout" button in the navigation
   - You'll be logged out and token removed

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  full_name: String,
  hashed_password: String (bcrypt),
  role: String ("user" or "admin"),
  created_at: DateTime
}
```

### Subscriptions Collection (Updated)
```javascript
{
  _id: ObjectId,
  user_id: String (references user _id),  // Changed from user_stub_id
  items: Array,
  frequency: String,
  start_date: DateTime,
  next_run_at: DateTime,
  status: String,
  created_at: DateTime
}
```

### Orders Collection (Updated)
```javascript
{
  _id: ObjectId,
  subscription_id: String,
  user_id: String (references user _id),  // Changed from user_stub_id
  items: Array,
  scheduled_for: DateTime,
  status: String,
  reason: String (optional),
  inventory_check: Array (optional),
  created_at: DateTime
}
```

## Next Steps

You can now:
- Register new users
- Login/logout
- Create subscriptions (authenticated users only)
- View orders (authenticated users only)
- Manage inventory (admin only)
- Run scheduler (admin only)

All previous features continue to work, now with proper authentication!
