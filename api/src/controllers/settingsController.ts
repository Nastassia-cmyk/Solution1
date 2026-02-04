import { Request, Response } from 'express';
import SettingsService from '../services/SettingsService';
import { AdminSettings } from '../types';

/**
 * Controller for admin settings endpoints
 */
export class SettingsController {
  /**
   * GET /api/admin/settings
   * Returns current settings including repository type
   */
  static getSettings(req: Request, res: Response): void {
    try {
      const settings = SettingsService.getSettings();
      res.json(settings);
    } catch (error) {
      console.error('[SettingsController] Error getting settings:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/admin/settings
   * Saves settings and returns updated settings
   * Body: { taskRepo: "memory" | "json" }
   */
  static saveSettings(req: Request, res: Response): void {
    try {
      const { taskRepo } = req.body;

      // Validate input
      if (taskRepo && !['memory', 'json'].includes(taskRepo)) {
        res.status(400).json({
          error: 'Invalid taskRepo value',
          message: 'taskRepo must be "memory" or "json"'
        });
        return;
      }

      // Save settings
      const settings = SettingsService.saveSettings({ taskRepo });
      
      res.json({
        success: true,
        message: 'Settings saved successfully. Server restart required to apply changes.',
        settings
      });
    } catch (error) {
      console.error('[SettingsController] Error saving settings:', error);
      res.status(500).json({ 
        error: 'Failed to save settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default SettingsController;
