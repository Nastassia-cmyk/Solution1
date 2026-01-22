# Quick Start Guide

## 🚀 Getting the Project Running in 5 Minutes

### Step 1: Install Dependencies

**Open PowerShell and run:**

```powershell
# Install backend dependencies
cd api
npm install
cd ..

# Install frontend dependencies
cd web
npm install
cd ..
```

### Step 2: Start Both Services

**Terminal 1 - Backend API:**
```powershell
cd api
npm run dev
```

Expected output:
```
Server is running on http://localhost:5000
```

**Terminal 2 - Frontend App:**
```powershell
cd web
npm run dev
```

Expected output:
```
VITE v5.0.2  ready in XXX ms

➜  Local:   http://localhost:3000/
```

### Step 3: Open in Browser

Navigate to `http://localhost:3000` - you're done! 🎉

## 📝 What You Can Do

1. **Create Tasks**: Fill the form on the left sidebar
   - Title (required)
   - Description (required)
   - Assign to a team member (optional)

2. **Manage Tasks**: Click any task to expand it
   - Change status (To Do → In Progress → Done)
   - Reassign to another team member
   - Edit title by double-clicking
   - Delete with the ✕ button

3. **Add Comments**: In expanded task view
   - Select your name from dropdown
   - Type your comment
   - Click "Post Comment"
   - Delete comments with the ✕ button

4. **Filter Tasks**: Use the filter buttons
   - All Tasks
   - To Do
   - In Progress
   - Done

## ⚠️ Important Notes

- **No Database**: Data resets when you refresh the page
- **This is intentional** for the MVP - perfect for prototyping
- **No Authentication**: Anyone can add comments as anyone
- **Team Members**: Fixed list (Alice, Bob, Charlie, Diana, Eve)

## 🔧 Useful Commands

### Backend
```powershell
cd api

npm run dev          # Development with ts-node
npm run build        # Compile TypeScript → JavaScript
npm start            # Run compiled code
npm run watch        # Watch mode for compilation
```

### Frontend
```powershell
cd web

npm run dev          # Development server with Vite
npm run build        # Production build
npm run preview      # Preview production build locally
```

## 📁 Key Files to Understand

### Backend Entry Point
```
api/src/server.ts         # Main Express setup
api/src/services/TaskService.ts   # All data logic
api/src/controllers/taskController.ts  # Request handlers
```

### Frontend Entry Point
```
web/src/main.tsx          # React entry point
web/src/App.tsx           # Main component
web/src/context/AppContext.tsx  # Global state
web/src/components/       # UI components
```

## 🆘 Troubleshooting

**Q: Port 5000 already in use**
- Find process: `Get-NetTCPConnection -LocalPort 5000`
- Kill process: `Stop-Process -Id <PID> -Force`
- Or change port in `api/src/server.ts`

**Q: Module not found errors**
- Delete `node_modules` folder
- Run `npm install` again
- Restart dev server

**Q: CORS errors in browser console**
- Ensure backend is running on port 5000
- Check `api/src/server.ts` for CORS middleware

**Q: Tasks disappear after refresh**
- This is expected! Data is in-memory only
- Refresh resets everything to start fresh

## 📚 API Documentation

Full API documentation is available in the main README.md

## ✨ Next Steps After MVP

Once you're comfortable with the MVP, you can:

1. Add a real database (MongoDB/PostgreSQL)
2. Add user authentication
3. Add more features (labels, attachments, etc.)
4. Deploy to production
5. Add real-time updates with WebSockets

---

**Happy task managing! 🎯**
