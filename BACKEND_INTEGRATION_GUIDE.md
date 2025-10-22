# 🔗 Backend Integration Guide

This guide explains how the frontend connects to the BAIS backend for storing business submissions and demo requests.

## 📋 Overview

The frontend now properly integrates with the BAIS backend to:
- Store contact form submissions
- Process business registration applications
- Handle demo requests
- Track submission status

## 🏗️ Architecture

```
Frontend (baintegrate)     Backend (BAIS)
├── Contact Form ──────────► /api/v1/contact
├── Business Registration ──► /api/v1/business-registration
└── Demo Requests ─────────► /api/v1/contact (with demo_requested: true)
```

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
# Navigate to BAIS directory
cd /Users/stephenbessey/Documents/Development/BAIS

# Start the backend server
./start_backend.sh
```

The backend will be available at:
- **API Base**: `http://localhost:8000`
- **Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

### 2. Test the Integration

```bash
# Run the test script
cd /Users/stephenbessey/Documents/Development/BAIS
python3 test_contact_endpoints.py
```

### 3. Start the Frontend

```bash
# Navigate to frontend directory
cd /Users/stephenbessey/Documents/Development/baintegrate

# Start the frontend server
python3 -m http.server 8001
```

The frontend will be available at `http://localhost:8001`

## 📡 API Endpoints

### Contact Form Submission
- **Endpoint**: `POST /api/v1/contact`
- **Purpose**: General contact form submissions and demo requests
- **Frontend**: ContactForm component

### Business Registration
- **Endpoint**: `POST /api/v1/business-registration`
- **Purpose**: Launch partner application submissions
- **Frontend**: FormValidation component (join.html)

## 🔧 Configuration

The frontend automatically detects the environment and uses the correct API URL:

```javascript
// In assets/js/core/config.js
API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'  // Local development
  : 'https://api.baintegrate.com'  // Production
```

## 📊 Data Flow

### Contact Form Submission
1. User fills out contact form
2. Frontend validates data using validation utilities
3. Data sent to `/api/v1/contact`
4. Backend stores submission and logs it
5. If demo requested, backend schedules demo
6. Frontend shows success message

### Business Registration
1. User completes multi-step business registration
2. Frontend validates each step
3. Final data sent to `/api/v1/business-registration`
4. Backend stores business registration
5. Frontend shows success step with next steps

## 🛠️ Development

### Backend Development
- **Main App**: `/Users/stephenbessey/Documents/Development/BAIS/app.py`
- **Contact Router**: `/Users/stephenbessey/Documents/Development/BAIS/backend/production/api/v1/contact_router.py`
- **Routes**: `/Users/stephenbessey/Documents/Development/BAIS/backend/production/routes.py`

### Frontend Development
- **Config**: `/Users/stephenbessey/Documents/Development/baintegrate/assets/js/core/config.js`
- **Contact Form**: `/Users/stephenbessey/Documents/Development/baintegrate/assets/js/components/ContactForm.js`
- **Business Form**: `/Users/stephenbessey/Documents/Development/baintegrate/assets/js/components/FormValidation.js`

## 🧪 Testing

### Manual Testing
1. Start both servers (backend on :8000, frontend on :8001)
2. Visit `http://localhost:8001/join.html`
3. Fill out the business registration form
4. Check backend logs for submission data
5. Visit `http://localhost:8001/pages/contact.html`
6. Fill out the contact form
7. Check backend logs for submission data

### Automated Testing
```bash
# Run the test script
cd /Users/stephenbessey/Documents/Development/BAIS
python3 test_contact_endpoints.py
```

## 📝 Data Storage

Currently, the backend logs all submissions to the console. For production, you would:

1. **Database Integration**: Connect to a proper database (PostgreSQL, MySQL)
2. **Data Persistence**: Store submissions in database tables
3. **Admin Dashboard**: Create admin interface to view submissions
4. **Email Notifications**: Send notifications when new submissions arrive

## 🔍 Monitoring

### Backend Logs
The backend logs all submissions with:
- Submission ID (UUID)
- Submission data
- Timestamp
- Submission type (contact_form or business_registration)

### Frontend Console
The frontend logs:
- Form validation results
- API request/response data
- Error messages
- Success confirmations

## 🚨 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check if port 8000 is available
   - Install required Python packages
   - Check Python version (3.8+)

2. **Frontend can't connect to backend**
   - Verify backend is running on localhost:8000
   - Check CORS configuration
   - Verify API endpoints in config.js

3. **Form submissions failing**
   - Check browser console for errors
   - Verify API endpoint URLs
   - Check backend logs for errors

### Debug Steps

1. **Check Backend Health**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test API Endpoints**
   ```bash
   curl -X POST http://localhost:8000/api/v1/contact \
     -H "Content-Type: application/json" \
     -d '{"first_name":"Test","last_name":"User","email":"test@example.com","message":"Test message"}'
   ```

3. **Check Frontend Console**
   - Open browser developer tools
   - Look for network errors
   - Check console for JavaScript errors

## 🎯 Next Steps

For production deployment:

1. **Database Setup**: Configure proper database connection
2. **Authentication**: Add API authentication if needed
3. **Email Integration**: Send confirmation emails
4. **Admin Dashboard**: Create admin interface for managing submissions
5. **Monitoring**: Add proper logging and monitoring
6. **Security**: Implement rate limiting and input validation

## 📞 Support

If you encounter issues:

1. Check the backend logs for error messages
2. Verify all dependencies are installed
3. Ensure both servers are running on correct ports
4. Check the API documentation at `http://localhost:8000/docs`

The integration is now complete and ready for testing! 🎉
