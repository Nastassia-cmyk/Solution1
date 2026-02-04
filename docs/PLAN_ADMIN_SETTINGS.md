# Admin Settings Feature - Implementation Plan

## Overview
This plan outlines the implementation of admin settings management for the Task Manager MVP, allowing users to view and change the task repository storage type (in-memory vs JSON file-based) through the admin dashboard.

## Requirements (from prompt_004.md)
1. **API Endpoints**:
   - `GET /api/admin/settings` - Returns current `{ taskRepo }` configuration
   - `POST /api/admin/settings` - Saves `{ taskRepo }` to `api/src/data/settings.json` with safe write operations

2. **Admin UI**:
   - Show current storage type in the settings page
   - Provide toggle/select control to change storage type
   - Display orange message indicating restart is required

## Implementation Strategy

### Phase 1: Backend API Endpoints

#### 1.1 Create Settings Model
- **File**: `api/src/types.ts`
- **Change**: Add `AdminSettings` interface with `taskRepo` field

#### 1.2 Create Settings Service
- **File**: `api/src/services/SettingsService.ts` (new)
- **Responsibilities**:
  - Read current settings from `api/src/data/settings.json` or return defaults
  - Validate and save settings with atomic file write operations
  - Return current `taskRepo` value

#### 1.3 Create Settings Controller
- **File**: `api/src/controllers/settingsController.ts` (new)
- **Endpoints**:
  - `GET /api/admin/settings` - Returns `{ taskRepo: "memory" | "json" }`
  - `POST /api/admin/settings` - Accepts `{ taskRepo: string }`, validates, saves

#### 1.4 Create Settings Routes
- **File**: `api/src/routes/adminRoutes.ts` (new)
- **Routes**: Mount settings controller endpoints

#### 1.5 Register Routes in Server
- **File**: `api/src/server.ts`
- **Change**: Add `app.use('/api/admin', adminRoutes);`

#### 1.6 Create Data Directory Structure
- **Directory**: `api/src/data/`
- **File**: `api/src/data/settings.json` (auto-created on first POST)
- **Content**: `{ "taskRepo": "memory" | "json" }`

### Phase 2: Frontend Components & State Management

#### 2.1 Create Settings Service/API Client
- **File**: `web/src/services/settingsApi.ts` (new)
- **Methods**:
  - `getSettings()` - Fetch current settings from API
  - `saveSettings(settings: AdminSettings)` - POST new settings

#### 2.2 Create Settings Context/Hook
- **File**: `web/src/context/SettingsContext.tsx` (new) OR extend `AppContext.tsx`
- **State**: 
  - `currentTaskRepo: string`
  - `pendingRestart: boolean`
  - Loading and error states

#### 2.3 Create Settings Page Component
- **File**: `web/src/components/pages/SettingsPage.tsx` (new)
- **Features**:
  - Display current storage type
  - Select dropdown to change storage type (memory/json)
  - Orange warning message: "⚠️ Restart required to apply changes"
  - Save button that calls API endpoint
  - Success/error notifications
  - Disable form while saving

#### 2.4 Create Settings Styles
- **File**: `web/src/styles/SettingsPage.css` (new)
- **Styles**:
  - Orange warning box styling
  - Form controls styling
  - Button styling

#### 2.5 Update Admin Navigation
- **File**: `web/src/components/layouts/AdminLayout.tsx`
- **Changes**:
  - Update hash-based routing to support `/admin/settings`
  - Show SettingsPage component when route is `/admin/settings`
  - Make "Settings" menu item active when on settings page

#### 2.6 Create Reusable Warning Component (Optional)
- **File**: `web/src/components/RestartWarning.tsx` (new)
- **Purpose**: Reusable orange warning message component
- **Props**: Message text, optional icon

### Phase 3: Types & Interfaces

#### 3.1 Update Shared Types
- **File**: `api/src/types.ts`
- **Additions**:
  - `AdminSettings` interface: `{ taskRepo: string }`
  - `RepositoryType` type: `"memory" | "json"`

- **File**: `web/src/types.ts`
- **Additions**:
  - Mirror `AdminSettings` interface for consistency
  - `RepositoryType` type

## File List Summary

### Backend Files (api/)
1. `api/src/types.ts` - UPDATE (add AdminSettings interface)
2. `api/src/services/SettingsService.ts` - CREATE
3. `api/src/controllers/settingsController.ts` - CREATE
4. `api/src/routes/adminRoutes.ts` - CREATE
5. `api/src/server.ts` - UPDATE (add admin routes)
6. `api/src/data/settings.json` - CREATE (auto-generated on first save)

### Frontend Files (web/)
1. `web/src/types.ts` - UPDATE (add AdminSettings interface)
2. `web/src/services/settingsApi.ts` - CREATE
3. `web/src/context/SettingsContext.tsx` - CREATE (optional, can extend AppContext)
4. `web/src/components/pages/SettingsPage.tsx` - CREATE
5. `web/src/components/RestartWarning.tsx` - CREATE
6. `web/src/styles/SettingsPage.css` - CREATE
7. `web/src/components/layouts/AdminLayout.tsx` - UPDATE (add routing and component display)

### Documentation
1. `README.md` - UPDATE (document new admin settings feature)

## Technical Considerations

1. **Safe Write Operations**: Use existing `fileOperations.ts` utilities for atomic file writes
2. **Default Settings**: If `settings.json` doesn't exist, default to `taskRepo: "memory"`
3. **Validation**: Validate that `taskRepo` value is either "memory" or "json"
4. **CORS**: Ensure admin API endpoints are covered by existing CORS middleware
5. **Hash-Based Routing**: Extend existing hash routing pattern in AdminLayout
6. **Context Management**: Can either create new SettingsContext or extend existing AppContext
7. **UI Feedback**: Use orange warning (#FFA500 or similar) to indicate restart requirement
8. **Error Handling**: Graceful error messages if settings read/write fails

## Notes

- Restart is required because `RepositoryFactory.createRepository()` is called once at server startup
- Settings persist in `api/src/data/settings.json` for data consistency
- The `/admin/settings` endpoint should be REST-compliant
- Frontend should prevent navigation away without saving (or confirm if needed)
- Consider adding "Current Repository Type" display in UI with visual indicator (badge)
