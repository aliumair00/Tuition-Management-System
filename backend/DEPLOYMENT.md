# Deployment Guide - Tuition Institute Management System

## 🚀 Quick Deployment Options

### Option 1: Docker Deployment (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t tuition-management .
docker run -d -p 5000:5000 --env-file .env tuition-management
```

### Option 2: Vercel Deployment (Serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Traditional VPS Deployment

```bash
# Clone repository
git clone <your-repo-url>
cd tuition-institute-management-system/backend

# Install dependencies
npm install --production

# Set up environment variables
cp .env.example .env
# Edit .env with your production values

# Start the application
npm start
```

## 🔧 Environment Variables Setup

Copy `.env.example` to `.env` and configure:

```bash
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
MONGO_DB_NAME=tution

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Email (optional, for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

## 🏗️ Production Checklist

### ✅ Security
- [ ] All credentials changed from development values
- [ ] `.env` file properly secured and not in version control
- [ ] HTTPS enabled with SSL certificate
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] CORS properly configured

### ✅ Database
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured for your server
- [ ] Database backups enabled

### ✅ Monitoring
- [ ] Health check endpoint configured (`/health`)
- [ ] Logging configured with Winston
- [ ] Error monitoring set up (recommended: Sentry)
- [ ] Uptime monitoring configured

### ✅ Performance
- [ ] CDN configured for static assets (optional)
- [ ] Database indexing optimized
- [ ] API response time monitored

## 🐳 Docker Commands

```bash
# Build image
docker build -t tuition-management .

# Run container
docker run -d \
  --name tuition-app \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/logs:/app/logs \
  tuition-management

# View logs
docker logs tuition-app

# Stop container
docker stop tuition-app

# Remove container
docker rm tuition-app
```

## 📊 Health Monitoring

The application includes a health check endpoint:

```bash
curl https://your-domain.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-12-14T12:00:00.000Z",
  "uptime": 3600
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **Port already in use**
   ```bash
   # Find process using port 5000
   lsof -ti:5000
   # Kill process
   kill -9 <PID>
   ```

2. **MongoDB connection failed**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format
   - Ensure database user has correct permissions

3. **CORS errors**
   - Verify `FRONTEND_URL` in `.env`
   - Check CORS configuration in app.js

4. **File upload issues**
   - Ensure uploads directory has write permissions
   - Check Cloudinary credentials

## 🚀 Post-Deployment

1. **Test all endpoints** using the provided `test-api.js`
2. **Set up monitoring** alerts for downtime
3. **Configure automated backups** for database
4. **Set up SSL certificate** renewal
5. **Monitor application logs** for errors

## 📞 Support

For deployment issues:
1. Check application logs: `docker logs <container-name>` or `pm2 logs`
2. Verify environment variables are set correctly
3. Test database connectivity
4. Check file permissions for uploads directory

---

**🎉 Your Tuition Institute Management System is now ready for production deployment!**