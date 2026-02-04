# Admin Settings Feature - Quick Reference

## Quick Start

### Navigate to Settings
1. Click "Admin" button in header
2. Click "Settings" in sidebar
3. Or use URL: `http://localhost:3000/#/admin/settings`

### Change Storage Type
1. Open Settings page
2. Select new storage type from dropdown
3. Click "Save Settings"
4. See orange restart warning
5. Restart backend server: `npm run dev` in `api/` folder
6. Refresh browser (data will persist if using JSON mode)

## API Quick Reference

### Get Current Settings
```bash
GET /api/admin/settings
```

**Response:**
```json
{
  "taskRepo": "memory" | "json"
}
```

### Save Settings
```bash
POST /api/admin/settings
Content-Type: application/json

{
  "taskRepo": "memory" | "json"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings saved successfully. Server restart required to apply changes.",
  "settings": {
    "taskRepo": "memory" | "json"
  }
}
```

## File Locations

- **Frontend Settings Page**: `web/src/components/pages/SettingsPage.tsx`
- **Settings API Client**: `web/src/services/settingsApi.ts`
- **Settings Context**: `web/src/context/SettingsContext.tsx`
- **Backend Settings Service**: `api/src/services/SettingsService.ts`
- **Backend Settings Controller**: `api/src/controllers/settingsController.ts`
- **Admin Routes**: `api/src/routes/adminRoutes.ts`
- **Settings Data File**: `api/src/data/settings.json` (auto-created)

## Storage Types Explained

### In-Memory (Default)
- **Setting Value**: `"memory"`
- **Data Location**: Application RAM
- **Persistence**: Data lost on restart
- **Use Case**: Development, testing
- **No Setup**: Works out of the box

### JSON File (Persistent)
- **Setting Value**: `"json"`
- **Data Location**: `api/src/data/tasks.json`
- **Persistence**: Data survives restart
- **Use Case**: Production, demo
- **Auto-create**: Directory and file created automatically

## Environment Variables

### Start with JSON Storage
```bash
# Linux/Mac
cd api
TASK_REPO=json npm run dev

# Windows PowerShell
cd api
$env:TASK_REPO="json"; npm run dev

# Windows CMD
cd api
set TASK_REPO=json
npm run dev
```

### Using .env File
```bash
cd api
echo "TASK_REPO=json" > .env
npm run dev
```

## UI Components

### Restart Warning
- Orange background (#fff3e0)
- Orange border (#ffa500)
- Shows when settings change pending save
- Auto-hides after successful save

### Settings Form
- Dropdown selector for storage type
- Current storage type display
- Save button (disabled when no changes)
- Success/error messages
- Loading state during save

## Common Tasks

### Check Current Settings
```bash
curl http://localhost:5000/api/admin/settings
```

### Change to JSON Storage
```bash
curl -X POST http://localhost:5000/api/admin/settings \
  -H "Content-Type: application/json" \
  -d '{"taskRepo":"json"}'
```
Then restart the backend.

### Verify Settings Saved
Check `api/src/data/settings.json`:
```json
{
  "taskRepo": "json"
}
```

## Troubleshooting

### Settings Not Persisting
- Ensure `api/src/data/` directory exists
- Check `api/src/data/settings.json` file permissions
- Verify POST request was successful (check response)

### Changes Not Applied
- **Must restart backend** for settings to take effect
- Stop: Ctrl+C in api terminal
- Start: `npm run dev` in api folder

### Orange Warning Not Showing
- Check browser console for errors
- Verify settings context provider wraps the page
- Check CSS file `web/src/styles/RestartWarning.css` is imported

### Settings Not Loading
- Check network tab in browser dev tools
- Verify backend is running on port 5000
- Check API response: `GET /api/admin/settings`

## Integration Points

### Frontend
- `AdminLayout.tsx` - Navigation and routing
- `SettingsContext.tsx` - State management
- `SettingsPage.tsx` - UI component
- `settingsApi.ts` - API communication

### Backend
- `adminRoutes.ts` - Route handlers
- `settingsController.ts` - Request processing
- `SettingsService.ts` - Business logic
- `fileOperations.ts` - Safe file I/O

## Data Flow

1. **User opens Settings page**
   - SettingsProvider mounts
   - Calls `settingsApi.getSettings()`
   - Fetches current settings from API
   - Updates SettingsContext state

2. **User changes setting**
   - Updates component local state
   - Enable save button

3. **User clicks Save**
   - Call `settingsApi.saveSettings()`
   - POST to `/api/admin/settings`
   - Backend validates and saves to `settings.json`
   - Show success message
   - Show orange restart warning

4. **User restarts server**
   - Server reads `settings.json`
   - `RepositoryFactory` uses new setting
   - Tasks now use selected storage type

## Security Notes

- No authentication required in MVP
- Settings validation on both frontend and backend
- Safe file writes using atomic operations
- Input validation for repository type values
- CORS enabled for admin API

## Performance Considerations

- Settings loaded once when Settings page mounts
- No polling or real-time updates
- Small JSON file (< 1KB)
- No impact on task operations
