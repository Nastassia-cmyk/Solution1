import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import RestartWarning from '../RestartWarning';
import '../../styles/SettingsPage.css';

export const SettingsPage: React.FC = () => {
  const settingsContext = useContext(SettingsContext);
  
  if (!settingsContext) {
    return (
      <div className="settings-page">
        <div className="settings-error">Failed to load settings context</div>
      </div>
    );
  }

  const { settings, loading, error, restartRequired, saveSettings } = settingsContext;
  const [selectedRepo, setSelectedRepo] = useState<string>('memory');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setSelectedRepo(settings.taskRepo);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);
      await saveSettings({ taskRepo: selectedRepo as 'memory' | 'json' });
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully! Server restart required to apply changes.'
      });
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save settings'
      });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = settings && selectedRepo !== settings.taskRepo;

  if (loading && !settings) {
    return (
      <div className="settings-page">
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      {error && !settings && (
        <div className="settings-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {restartRequired && (
        <RestartWarning message="Restart required to apply changes" visible={true} />
      )}

      <div className="settings-section">
        <h3>Data Storage</h3>
        <p className="settings-description">
          Choose where tasks will be stored. Changes require a server restart.
        </p>

        <div className="settings-form">
          <div className="settings-form-group">
            <label htmlFor="taskRepo" className="settings-label">Repository Type</label>
            <select
              id="taskRepo"
              className="settings-select"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              disabled={saving}
            >
              <option value="memory">In-Memory (temporary, lost on restart)</option>
              <option value="json">JSON File (persistent)</option>
            </select>
            <p className="settings-help-text">
              {selectedRepo === 'memory'
                ? 'Data is stored in memory and will be lost when the server restarts.'
                : 'Data is stored in api/src/data/tasks.json and persists across restarts.'}
            </p>
          </div>

          <div className="settings-current">
            <p>
              <strong>Current Storage:</strong> {settings?.taskRepo === 'memory' ? 'In-Memory' : 'JSON File'}
            </p>
          </div>

          {saveMessage && (
            <div className={`settings-message settings-message-${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}

          <button
            className="settings-save-btn"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            data-qa="settings-save-button"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
