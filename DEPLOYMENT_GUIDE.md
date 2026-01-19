# Vercel Deployment Guide

To ensure your application works correctly on Vercel, please follow these steps.

## 1. Environment Variables
You must configure the Environment Variables in your Vercel project settings for both the Frontend and Backend.

### Backend Project (Node.js/Express)
Go to **Settings > Environment Variables** and add the following:

- `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
- `MONGO_DB_NAME`: The database name.
- `JWT_SECRET`: A secure random string for tokens.
- `JWT_REFRESH_SECRET`: Another secure random string.
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.
- `FRONTEND_URL`: The URL of your **Frontend** Vercel deployment (e.g., `https://your-frontend.vercel.app`). **CRITICAL for CORS.**
- `NODE_ENV`: Set to `production`.

### Frontend Project (Vite/React)
Go to **Settings > Environment Variables** and add the following:

- `VITE_API_URL`: The URL of your **Backend** Vercel deployment (e.g., `https://your-backend.vercel.app`).
  - **Note:** Do NOT add a trailing slash (e.g., use `...verify.app`, not `...verify.app/`).

## 2. Push to GitHub
Commit and push the changes made by the AI (Cloudinary config, vercel.json, API updates) to your GitHub repository.

## 3. Redeploy
Once the environment variables are set, go to the **Deployments** tab in Vercel and **Redeploy** the latest commit for both projects.

## Common Issues & Fixes
- **404 on Refresh:** If refreshing a page gives a 404, ensure the `frontend/vercel.json` file exists (I created this for you).
- **Images Not Loading:** Ensure Cloudinary credentials are correct. Local uploads do NOT work on Vercel.
- **CORS Errors:** Ensure `FRONTEND_URL` in Backend matches the actual Frontend URL exactly (https vs http, trailing slash).
