import { AdminSettings } from '../types';

const API_BASE = '/api';

/**
 * Settings API client
 * Handles communication with admin settings endpoints
 */
export const settingsApi = {
  /**
   * Get current admin settings
   */
  getSettings: async (): Promise<AdminSettings> => {
    const res = await fetch(`${API_BASE}/admin/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  /**
   * Save admin settings
   * @param settings - Settings object with taskRepo field
   */
  saveSettings: async (settings: Partial<AdminSettings>): Promise<{ success: boolean; message: string; settings: AdminSettings }> => {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to save settings');
    }
    return res.json();
  },
};
