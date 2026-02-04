import React from 'react';
import '../styles/RestartWarning.css';

export interface RestartWarningProps {
  message?: string;
  visible?: boolean;
}

export const RestartWarning: React.FC<RestartWarningProps> = ({ 
  message = 'Restart required to apply changes',
  visible = true 
}) => {
  if (!visible) return null;

  return (
    <div className="restart-warning">
      <span className="restart-warning-icon">⚠️</span>
      <span className="restart-warning-message">{message}</span>
    </div>
  );
};

export default RestartWarning;
