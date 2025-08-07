# Render Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. "Render still does not process requests"

**Symptoms:**
- App deploys but returns 404 or timeout errors
- Health check endpoint doesn't respond
- No logs showing request processing

**Solutions:**

#### A. Check Environment Variables
Make sure these are set in your Render service:
```bash
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_URL_UNPOOLED=postgresql://username:password@host:port/database
FLASK_ENV=production
```

#### B. Check Build Logs
1. Go to your Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for errors during build or startup

#### C. Test Health Check
```bash
curl https://your-app-name.onrender.com/
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "2025-08-07T..."
}
```

### 2. Database Connection Issues

**Symptoms:**
- Health check shows "database": "disconnected"
- Database-related endpoints fail
- SSL connection errors

**Solutions:**

#### A. Check Database URL Format
Make sure your DATABASE_URL is in the correct format:
```
postgresql://username:password@host:port/database?sslmode=require
```

#### B. Test Database Connection
Run the test script locally:
```bash
python3 test_render_deployment.py
```

#### C. Check Database Permissions
Ensure your database allows connections from Render's IP addresses.

### 3. Import Errors

**Symptoms:**
- Build fails with import errors
- Missing dependencies

**Solutions:**

#### A. Check requirements.txt
Make sure all dependencies are listed:
```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-SocketIO==5.3.6
SQLAlchemy==2.0.21
requests>=2.32.3
python-dotenv==1.0.0
billboard==0.4.0
bcrypt==4.0.1
```

#### B. Test Imports Locally
```bash
python3 -c "from app import app; print('✅ Imports work')"
```

### 4. Port Binding Issues

**Symptoms:**
- App starts but doesn't respond to requests
- "Address already in use" errors

**Solutions:**

#### A. Check Host Binding
Your app.py should have:
```python
app.run(host="0.0.0.0", port=port, debug=debug)
```

#### B. Check Procfile
Should be:
```
web: python app.py
```

### 5. CORS Issues

**Symptoms:**
- Frontend can't connect to backend
- CORS errors in browser console

**Solutions:**

#### A. Check CORS Configuration
Your app.py should have:
```python
CORS(app, origins=[
    "https://song-application.vercel.app",
    "https://song-application-p2ab.onrender.com", 
    "http://localhost:3000",
    "http://127.0.0.1:3000"
], supports_credentials=True)
```

#### B. Test CORS Headers
```bash
curl -H "Origin: https://song-application.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://your-app-name.onrender.com/login/user
```

## Debugging Steps

### 1. Check Render Logs
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for error messages

### 2. Test Endpoints
```bash
# Health check
curl https://your-app-name.onrender.com/

# Test chart endpoint
curl https://your-app-name.onrender.com/charts/billboard/hot-100

# Test with headers
curl -H "Content-Type: application/json" \
     -d '{"name":"test","password":"test"}' \
     https://your-app-name.onrender.com/login/user
```

### 3. Run Local Tests
```bash
# Test deployment configuration
python3 test_render_deployment.py

# Test Flask app
python3 -c "from app import app; print('✅ Flask app works')"

# Test database
python3 -c "from database_manager import test_connection; test_connection()"
```

### 4. Check Environment Variables
Make sure these are set in Render:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `FLASK_ENV=production`

## Common Error Messages

### "Cannot install -r requirements.txt"
- Check for dependency conflicts
- Update requirements.txt with compatible versions

### "SSL connection has been closed unexpectedly"
- Use `DATABASE_URL_UNPOOLED` instead of `DATABASE_URL`
- Check database connection string format

### "Address already in use"
- Make sure you're binding to `0.0.0.0`
- Check that `PORT` environment variable is set

### "No module named 'xyz'"
- Add missing dependencies to requirements.txt
- Check import statements in your code

## Quick Fixes

### 1. Restart Service
1. Go to Render dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

### 2. Check Environment Variables
1. Go to Render dashboard
2. Click on your service
3. Go to "Environment" tab
4. Verify all required variables are set

### 3. Test Locally First
```bash
# Set environment variables
export DATABASE_URL="your-database-url"
export FLASK_ENV="production"
export PORT="5001"

# Test the app
python3 app.py
```

## Still Having Issues?

1. **Check Render Status**: Visit https://status.render.com
2. **Review Logs**: Look for specific error messages
3. **Test Incrementally**: Test each component separately
4. **Contact Support**: If issues persist, contact Render support

## Success Checklist

- [ ] App deploys without build errors
- [ ] Health check returns `{"status": "healthy"}`
- [ ] Database connection works
- [ ] Chart endpoints respond
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser
- [ ] All environment variables set correctly 