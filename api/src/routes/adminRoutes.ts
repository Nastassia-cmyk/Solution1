import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController';

const router = Router();

/**
 * Admin API Routes
 * Routes for system administration and configuration
 */

// Settings routes
router.get('/settings', SettingsController.getSettings);
router.post('/settings', SettingsController.saveSettings);

export default router;
