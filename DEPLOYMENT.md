# Deploying Amanat-E-Nazirpara to Render

This guide walks you through deploying the Amanat-E-Nazirpara Masjid Management System to Render.

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub account with the project repository
- ✅ A Render account (sign up at [render.com](https://render.com))
- ✅ A MongoDB Atlas account (or another MongoDB hosting service)
- ✅ A Cloudinary account for image hosting
- ✅ (Optional) Email SMTP credentials for contact form

## Step-by-Step Deployment Guide

### 1. Prepare Your MongoDB Database

#### Option A: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region closest to your users
   - Click "Create"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `amanat-nazirpara`
   - Example: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/amanat-nazirpara?retryWrites=true&w=majority`

### 2. Set Up Cloudinary

1. **Create Account**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account (25GB storage, 25GB monthly bandwidth)

2. **Get API Credentials**
   - After login, go to Dashboard
   - Copy these values:
     - Cloud Name
     - API Key
     - API Secret

### 3. Configure Email (Optional)

#### For Gmail:

1. **Enable 2-Step Verification**
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn On

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Amanat Nazirpara" and click Generate
   - Copy the 16-character password

### 4. Deploy to Render

#### 4.1. Create Web Service

1. **Login to Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Connect your GitHub account if not already connected

2. **Create New Web Service**
   - Click "New +" button → "Web Service"
   - Connect your GitHub repository
   - If not visible, click "Configure account" to grant access

3. **Configure Build Settings**
   - **Name**: `amanat-nazirpara` (or your preferred name)
   - **Region**: Choose closest to your target users
   - **Branch**: `main` (or your primary branch)
   - **Root Directory**: `frontend-combined`
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install -g pnpm && pnpm install && pnpm build
     ```
   - **Start Command**:
     ```bash
     pnpm start
     ```

4. **Choose Instance Type**
   - **Free**: Good for testing, sleeps after 15min inactivity
   - **Starter ($7/mo)**: Recommended for production, always on
   - **Standard ($25/mo)**: For higher traffic

#### 4.2. Configure Environment Variables

In the "Environment" section, add these variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amanat-nazirpara

# JWT Authentication (generate strong secret)
JWT_SECRET=your-production-jwt-secret-min-32-characters-use-openssl-rand-base64-32
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@amanat-nazirpara.com

# Node Environment
NODE_ENV=production
```

**Important**: Click "Save Changes" after adding all variables.

#### 4.3. Deploy

1. Click "Create Web Service"
2. Wait for the build to complete (typically 5-10 minutes)
3. Watch the logs for any errors

### 5. Initial Setup After Deployment

#### 5.1. Seed Database (One-time)

1. **Access Render Shell**
   - Go to your service dashboard
   - Click "Shell" tab
   - Wait for shell to connect

2. **Run Seed Script**
   ```bash
   cd frontend-combined
   pnpm seed
   ```

3. **Default Admin Credentials**
   - Email: `admin@example.com`
   - Password: `admin123`
   - **⚠️ Change these immediately after first login!**

#### 5.2. Verify Deployment

1. Visit your Render URL (e.g., `https://amanat-nazirpara.onrender.com`)
2. Check the home page loads correctly
3. Navigate to `/admin/login`
4. Login with default credentials
5. Test key features:
   - Dashboard statistics
   - Image upload (gallery)
   - Create a test contribution
   - View public pages

### 6. Custom Domain (Optional)

#### 6.1. Configure Custom Domain in Render

1. Go to service Settings → "Custom Domain"
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `amanat-nazirpara.com`)
4. Render will provide DNS records to configure

#### 6.2. Update DNS Settings

At your domain registrar (GoDaddy, Namecheap, etc.):

1. Add CNAME record:
   - **Name**: `www` or `@`
   - **Value**: Your Render URL (e.g., `amanat-nazirpara.onrender.com`)

2. Wait for DNS propagation (can take up to 48 hours)

3. Render automatically provisions SSL certificate

### 7. Continuous Deployment

Render automatically deploys when you push to your connected branch:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Render automatically detects changes and redeploys

### 8. Monitoring & Maintenance

#### View Logs
- Go to Render Dashboard → Your Service → "Logs" tab
- Monitor for errors or issues
- Logs are searchable and filterable

#### Monitor Performance
- Check "Metrics" tab for:
  - CPU usage
  - Memory usage
  - Response times
  - Request counts

#### Set Up Alerts (Paid Plans)
- Configure email notifications for:
  - Deploy failures
  - Service downtime
  - High resource usage

### 9. Backup Strategy

#### Database Backups
1. **MongoDB Atlas** (Automatic):
   - Free tier: Automatic backups enabled
   - Access via Atlas Dashboard → Backup tab

2. **Manual Backup**:
   ```bash
   mongodump --uri="your-mongodb-uri" --out=./backup
   ```

#### Code Backups
- Your GitHub repository serves as primary backup
- Consider enabling GitHub branch protection rules

### 10. Troubleshooting

#### Build Fails

**Issue**: pnpm not found
```bash
# Update build command to:
npm install -g pnpm && pnpm install && pnpm build
```

**Issue**: Out of memory during build
- Upgrade to a higher instance type
- Or use `NODE_OPTIONS=--max-old-space-size=4096` in environment variables

#### Runtime Issues

**Issue**: MongoDB connection timeout
- Verify MONGODB_URI is correct
- Check MongoDB Atlas whitelist includes `0.0.0.0/0`
- Verify database user credentials

**Issue**: Images not uploading
- Verify Cloudinary credentials
- Check file size limits (default 10MB)
- Review logs for specific errors

**Issue**: 404 on some routes
- Ensure `next.config.ts` is properly configured
- Check middleware.ts for route protection issues
- Verify build completed successfully

#### Service Sleeping (Free Tier)
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Solution: Upgrade to Starter plan ($7/mo)

### 11. Security Best Practices

✅ **Change Default Credentials**
- Change admin password immediately after deployment

✅ **Environment Variables**
- Never commit `.env` files to Git
- Use strong, unique JWT_SECRET
- Rotate secrets periodically

✅ **Database Security**
- Use strong database passwords
- Regularly review database access logs
- Keep MongoDB Atlas IP whitelist updated

✅ **HTTPS**
- Render provides automatic HTTPS
- Ensure all external resources use HTTPS

✅ **Regular Updates**
- Keep dependencies updated
- Monitor for security vulnerabilities
- Apply patches promptly

### 12. Cost Estimation

#### Free Tier (Testing Only)
- Render: Free (with limitations)
- MongoDB Atlas: Free (M0 - 512MB storage)
- Cloudinary: Free (25GB storage, 25GB bandwidth/month)
- **Total**: $0/month

#### Production Setup (Recommended)
- Render Starter: $7/month
- MongoDB Atlas M10: $57/month (or M0 Free for small sites)
- Cloudinary Free: $0/month
- **Total**: ~$7-64/month (depending on database tier)

#### High Traffic Setup
- Render Standard: $25/month
- MongoDB Atlas M20: $126/month
- Cloudinary Pro: $99/month (200GB bandwidth)
- **Total**: ~$250/month

### 13. Next Steps After Deployment

1. ✅ Change default admin credentials
2. ✅ Set up committee information
3. ✅ Upload gallery images
4. ✅ Configure site settings
5. ✅ Add land donors and contributions
6. ✅ Test all features thoroughly
7. ✅ Set up monitoring and alerts
8. ✅ Create backup strategy
9. ✅ Share site URL with stakeholders
10. ✅ Gather feedback and iterate

### 14. Support Resources

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Next.js Deployment**: https://nextjs.org/docs/deployment

### 15. Quick Reference Commands

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Check logs (via Render Shell)
tail -f /var/log/render-service.log

# Database backup
mongodump --uri="your-mongodb-uri" --out=./backup

# Database restore
mongorestore --uri="your-mongodb-uri" ./backup

# Clear build cache (if needed)
# In Render Dashboard: Settings → Clear Build Cache → Clear Cache & Deploy
```

---

## Need Help?

If you encounter issues during deployment:

1. Check Render logs for specific error messages
2. Review this guide carefully
3. Consult Render documentation
4. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details

Good luck with your deployment! 🚀
