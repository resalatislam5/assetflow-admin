import {
  CloseOutlined,
  CloudDownloadOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { useAppUpdate } from '../../hooks/useAppUpdate';
import './AppUpdatePrompt.css';

export const AppUpdatePrompt = () => {
  const {
    hasUpdate,
    latestVersion,
    isDismissed,
    dismissUpdate,
    restorePrompt,
    applyUpdate,
  } = useAppUpdate();

  const [isUpdating, setIsUpdating] = useState(false);

  if (!hasUpdate) {
    return null;
  }

  if (isDismissed) {
    return (
      <div
        className="app-update-prompt-wrapper"
        role="status"
        aria-live="polite"
      >
        <div
          className="app-update-pill"
          onClick={restorePrompt}
          title="Click to view update details"
        >
          <span className="app-update-pulse-dot" />
          <span className="app-update-pill-text">
            <SyncOutlined className="app-update-pill-icon" spin />
            Update Available
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-update-prompt-wrapper"
      role="dialog"
      aria-labelledby="app-update-title"
    >
      <div className="app-update-card">
        <div className="app-update-header">
          <div className="app-update-header-left">
            <div className="app-update-icon-box">
              <CloudDownloadOutlined />
            </div>
            <div className="app-update-title-group">
              <span id="app-update-title" className="app-update-title">
                New Update Available
              </span>
              {latestVersion && (
                <span className="app-update-version-tag">
                  Build: {latestVersion.slice(-8)}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="app-update-close-btn"
            onClick={dismissUpdate}
            aria-label="Dismiss update notification"
          >
            <CloseOutlined />
          </button>
        </div>

        <div className="app-update-body">
          A newer version of AssetFlow Admin has been deployed. Reload to update
          and refresh application assets safely.
        </div>

        <div className="app-update-actions">
          <Button
            size="middle"
            onClick={dismissUpdate}
            className="app-update-btn-later"
          >
            Later
          </Button>
          <Button
            type="primary"
            size="middle"
            loading={isUpdating}
            icon={<ReloadOutlined spin={isUpdating} />}
            onClick={async () => {
              setIsUpdating(true);
              await applyUpdate();
            }}
            className="app-update-btn-reload"
          >
            Reload & Update
          </Button>
        </div>
      </div>
    </div>
  );
};
