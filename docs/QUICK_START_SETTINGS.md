# Admin Settings - Quick Start Card

## Access Settings Page

```
URL: http://localhost:3000/#/admin/settings

OR

1. Click "Admin" button (top right)
2. Click "Settings" in sidebar
```

---

## Change Storage Type

```
1. Open Settings page
2. Select option from dropdown:
   • In-Memory (data lost on restart)
   • JSON File (data persists)
3. Click "Save Settings"
4. See orange warning ⚠️
5. Restart backend:
   - Ctrl+C in backend terminal
   - npm run dev
6. Done! New storage type active
```

---

## API Quick Commands

### Check Current Settings
```bash
curl http://localhost:5000/api/admin/settings
```

### Save to JSON Storage
```bash
curl -X POST http://localhost:5000/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"taskRepo":"json"}'
```

### Save to Memory Storage
```bash
curl -X POST http://localhost:5000/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"taskRepo":"memory"}'
```

---

## Environment Variable Method

### Linux/Mac
```bash
cd api
TASK_REPO=json npm run dev
```

### Windows PowerShell
```powershell
cd api
$env:TASK_REPO="json"; npm run dev
```

### Windows CMD
```cmd
cd api
set TASK_REPO=json
npm run dev
```

---

## File Locations

```
Frontend:
  web/src/components/pages/SettingsPage.tsx
  web/src/context/SettingsContext.tsx
  web/src/services/settingsApi.ts

Backend:
  api/src/services/SettingsService.ts
  api/src/controllers/settingsController.ts
  api/src/routes/adminRoutes.ts

Settings Data:
  api/src/data/settings.json
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Page won't load | Backend running on 5000? Check logs |
| Settings not saving | Check file permissions on api/src/data/ |
| Changes not applied | Must restart backend after save |
| Orange warning won't go away | Refresh page or restart backend |
| API returns error 400 | Only "memory" and "json" are valid |

---

## Testing Checklist

- [ ] Settings page loads
- [ ] Can see current storage type
- [ ] Can change storage type
- [ ] Save button works
- [ ] Orange warning appears
- [ ] settings.json file created/updated
- [ ] Backend restart works
- [ ] New storage type active

---

## Key Points

⭐ **Must Restart Backend** after saving settings
🟠 **Orange Warning** means restart required
📁 **Settings File**: api/src/data/settings.json
🔄 **Repository Switch**: Happens at server startup
💾 **Auto Saves**: Settings file auto-created

---

## Feature Highlights

✅ Easy dropdown selector
✅ Real-time validation
✅ Clear error messages
✅ Settings persisted to file
✅ Orange restart indicator
✅ No data loss
✅ Atomic file operations

---

## Support

📖 Full Guide: docs/ADMIN_SETTINGS_GUIDE.md
🧪 Testing: docs/TESTING_ADMIN_SETTINGS.md
🏗️ Architecture: docs/ARCHITECTURE_ADMIN_SETTINGS.md
📋 Checklist: IMPLEMENTATION_CHECKLIST.md

---

## Default Values

| Setting | Default | Options |
|---------|---------|---------|
| taskRepo | memory | memory, json |

---

## Data Persistence Comparison

| Type | Location | Persists? | Use Case |
|------|----------|-----------|----------|
| Memory | RAM | ❌ Lost on restart | Dev/Testing |
| JSON | File | ✅ Survives restart | Production |

---

Made with ❤️ for the Task Manager MVP
