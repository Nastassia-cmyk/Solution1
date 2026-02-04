import path from 'path';
import fs from 'fs';
import { AdminSettings, RepositoryType } from '../types';
import { safeWriteFile } from '../utils/fileOperations';

const SETTINGS_FILE = path.join(__dirname, '..', 'data', 'settings.json');
const DEFAULT_SETTINGS: AdminSettings = {
  taskRepo: 'memory'
};

/**
 * Service for managing admin settings
 * Handles reading and persisting settings like repository type
 */
class SettingsService {
  /**
   * Get current settings
   * Returns settings from settings.json if it exists, otherwise returns defaults
   */
  getSettings(): AdminSettings {
    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        const settings = JSON.parse(content);
        return this.validateSettings(settings);
      }
    } catch (error) {
      console.error('[SettingsService] Error reading settings:', error);
    }
    
    return DEFAULT_SETTINGS;
  }

  /**
   * Save settings to file
   * Validates settings before saving
   * 
   * @param settings - Settings to save
   * @throws Error if settings validation fails
   */
  saveSettings(settings: Partial<AdminSettings>): AdminSettings {
    // Validate taskRepo value if provided
    if (settings.taskRepo) {
      if (!['memory', 'json'].includes(settings.taskRepo)) {
        throw new Error(
          `Invalid taskRepo value: "${settings.taskRepo}". Must be "memory" or "json".`
        );
      }
    }

    // Merge with existing settings
    const currentSettings = this.getSettings();
    const updatedSettings = {
      ...currentSettings,
      ...settings
    };

    // Validate the final settings object
    const validatedSettings = this.validateSettings(updatedSettings);

    // Save to file
    try {
      const content = JSON.stringify(validatedSettings, null, 2);
      safeWriteFile(SETTINGS_FILE, content);
      console.log('[SettingsService] Settings saved:', validatedSettings);
      return validatedSettings;
    } catch (error) {
      throw new Error(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate settings object
   * Ensures required fields are present and have valid values
   */
  private validateSettings(settings: any): AdminSettings {
    if (!settings || typeof settings !== 'object') {
      return DEFAULT_SETTINGS;
    }

    const taskRepo = settings.taskRepo;
    
    if (!taskRepo || !['memory', 'json'].includes(taskRepo)) {
      return DEFAULT_SETTINGS;
    }

    return {
      taskRepo: taskRepo as RepositoryType
    };
  }
}

export default new SettingsService();
