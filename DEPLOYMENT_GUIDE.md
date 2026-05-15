# Deployment & Connection Testing Guide 🚀

## Issues Fixed

### 1. ✅ Backend CORS Configuration
- Added CORS middleware to allow requests from your Vercel frontend
- Added health check endpoint at root URL

### 2. ✅ Frontend API Configuration  
- Created environment-based API configuration
- Separated development and production URLs
- Updated all API calls to use environment variables

---

## Backend Deployment on Render

### 1. Install CORS (if not already done)
```bash
cd server
npm install
```

### 2. Set Environment Variable on Render
Go to your Render dashboard → Your service → Environment:
```
FRONTEND_URL=https://pc-part-compare-2xws.vercel.app
```

### 3. Redeploy Backend
- Render will auto-deploy when you push to GitHub
- Or manually deploy from Render dashboard

### 4. Test Backend Health
Open in browser or use curl:
```bash
curl https://pc-part-compare-backend.onrender.com/
```

Expected response:
```json
{
  "success": true,
  "message": "PC Part Compare API is running",
  "timestamp": "2026-02-22T..."
}
```

### 5. Test Backend API Endpoints
```bash
# Test parts endpoint
curl https://pc-part-compare-backend.onrender.com/api/parts

# Test health endpoint (if you have one)
curl https://pc-part-compare-backend.onrender.com/api/health
```

---

## Frontend Deployment on Vercel

### 1. Set Environment Variable on Vercel
Go to Vercel dashboard → Your project → Settings → Environment Variables:

Add this variable:
```
VITE_API_URL=https://pc-part-compare-backend.onrender.com
```

**Important:** Set it for **Production** environment!

### 2. Redeploy Frontend
After adding the environment variable, you MUST redeploy:
- Go to Deployments tab
- Click "..." on latest deployment
- Select "Redeploy"
- ✅ Check "Use existing Build Cache" is OFF (to rebuild with new env var)

Or push a new commit to trigger automatic deployment.

---

## Testing the Connection

### Method 1: Browser Developer Tools
1. Open https://pc-part-compare-2xws.vercel.app/browse
2. Open DevTools (F12) → Console tab
3. Check for errors:
   - ❌ CORS errors → Backend needs FRONTEND_URL env var
   - ❌ 404 errors → Backend routes might be wrong
   - ❌ Network failed → Backend might be down
   - ✅ No errors + data loads → Success!

### Method 2: Network Tab
1. Open https://pc-part-compare-2xws.vercel.app/browse
2. Open DevTools (F12) → Network tab
3. Reload page
4. Look for API calls to Render backend
5. Click on the request and check:
   - Status: Should be `200 OK`
   - Response: Should contain your parts data
   - Headers: Check `Access-Control-Allow-Origin` is set

### Method 3: Test Backend Directly
Open these URLs in your browser:

```
https://pc-part-compare-backend.onrender.com/
https://pc-part-compare-backend.onrender.com/api/parts
https://pc-part-compare-backend.onrender.com/api/health
```

---

## Common Issues & Solutions

### Issue 1: CORS Error
```
Access to fetch at 'https://pc-part-compare-backend.onrender.com'
from origin 'https://pc-part-compare-2xws.vercel.app' has been blocked by CORS policy
```

**Solution:**
- Add `FRONTEND_URL=https://pc-part-compare-2xws.vercel.app` to Render environment variables
- Redeploy backend on Render

### Issue 2: Frontend Still Uses Localhost
```
GET http://localhost:5000/api/parts net::ERR_CONNECTION_REFUSED
```

**Solution:**
- Add `VITE_API_URL=https://pc-part-compare-backend.onrender.com` to Vercel environment variables
- Redeploy frontend (with cache cleared)

### Issue 3: Backend Returns 404
```
GET https://pc-part-compare-backend.onrender.com/api/parts 404 Not Found
```

**Solution:**
- Check your backend routes are correct
- Make sure your backend is running without errors
- Check Render logs for startup errors

### Issue 4: Backend Sleeps (Render Free Tier)
Render free tier spins down after 15 minutes of inactivity.

**Solution:**
- First request might take 30-60 seconds to wake up
- Consider using a health check service to keep it awake
- Or upgrade to paid Render plan

### Issue 5: MongoDB Connection Error
**Solution:**
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Render's IP addresses to whitelist
- Verify `MONGODB_URI` is set correctly in Render environment variables

---

## Environment Variables Checklist

### Backend (Render)
- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Your JWT secret key
- [ ] `FRONTEND_URL` - Your Vercel frontend URL
- [ ] `NODE_ENV` (optional) - Set to `production`
- [ ] `PORT` (auto-set by Render)

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Your Render backend URL (without trailing slash)

---

## Quick Test Commands

### Test from Command Line
```bash
# Test backend health
curl https://pc-part-compare-backend.onrender.com/

# Test parts endpoint
curl https://pc-part-compare-backend.onrender.com/api/parts

# Test with headers (simulate browser)
curl -H "Origin: https://pc-part-compare-2xws.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://pc-part-compare-backend.onrender.com/api/parts
```

### Test from Browser Console
```javascript
// Paste this in browser console on your Vercel site
fetch('https://pc-part-compare-backend.onrender.com/api/parts')
  .then(r => r.json())
  .then(data => console.log('✅ Backend connected!', data))
  .catch(err => console.error('❌ Connection failed:', err));
```

---

## Next Steps After Deployment

1. **Test all pages:**
   - [ ] Browse page loads parts
   - [ ] Part detail page works
   - [ ] Login/Register works
   - [ ] Compare functionality works

2. **Monitor Backend Logs:**
   - Go to Render → Your service → Logs
   - Watch for errors during requests

3. **Check Database:**
   - Verify MongoDB has data
   - Run seed script if empty: `npm run seed`

4. **Performance:**
   - First load might be slow (Render cold start)
   - Subsequent requests should be fast

---

## Files Modified

### Backend
- `server/src/app.js` - Added CORS configuration and health check

### Frontend
- `client/.env` - Local development environment
- `client/.env.production` - Production environment
- `client/.env.example` - Example for other developers
- `client/src/config/api.js` - Centralized API configuration
- `client/src/context/AuthContext.jsx` - Updated to use API config
- `client/src/pages/Browse.jsx` - Updated to use API config

---

## Contact & Support

If issues persist:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend build errors  
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
5. Try redeploying both services after confirming env vars

**Pro Tip:** When changing environment variables, always redeploy without cache!
