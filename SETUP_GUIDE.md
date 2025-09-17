# Campus Research Hub - Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project

## 1. MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### Step 2: Get Connection String
1. In your MongoDB Atlas dashboard, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., `campus-research`)

### Step 3: Configure Backend
1. Copy `.env.example` to `.env` in the `campus-research-backend` folder:
   ```bash
   cd campus-research-backend
   cp .env.example .env
   ```

2. Edit the `.env` file and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-research?retryWrites=true&w=majority
   ```

## 2. Firebase Setup

### Step 1: Firebase Project
Your Firebase project is already configured with the following details:
- Project ID: `chjar-9703b`
- The configuration is already set up in `src/services/firebase.js`

### Step 2: Configure Frontend (Optional)
1. Copy `.env.example` to `.env` in the `campus-research-hub` folder:
   ```bash
   cd campus-research-hub
   cp .env.example .env
   ```

2. The Firebase configuration is already working, but you can customize it in the `.env` file if needed.

## 3. Running the Application

### Backend
```bash
cd campus-research-backend
npm install
npm run dev
```

### Frontend
```bash
cd campus-research-hub
npm install
npm start
```

## 4. Testing Connections

### Test MongoDB Connection
1. Start the backend server
2. Check the console for "✅ MongoDB connected" message
3. Visit `http://localhost:5001/api/health` to verify the API is running

### Test Firebase Connection
1. Start the frontend application
2. Try to sign up or log in to test Firebase Authentication
3. Check the browser console for any Firebase errors

## 5. Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_API_URL=http://localhost:5001/api
```

## 6. Security Notes
- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- The `.gitignore` file has been updated to exclude `.env` files
- For production, use proper environment variable management

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure your database user has proper permissions

### Firebase Issues
- Verify your Firebase project is active
- Check if Authentication is enabled in Firebase Console
- Ensure your domain is authorized in Firebase settings

### CORS Issues
- Make sure the frontend URL in backend `.env` matches your frontend URL
- Check if both servers are running on the correct ports