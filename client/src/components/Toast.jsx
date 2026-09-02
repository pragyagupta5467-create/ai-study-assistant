import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconClass = 'toast-icon-success';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconClass = 'toast-icon-error';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconClass = 'toast-icon-warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconClass = 'toast-icon-info';
        }

        return (
          <div key={toast.id} className={`toast-item toast-${toast.type || 'info'}`}>
            <div className={`toast-icon ${iconClass}`}>
              <Icon size={18} />
            </div>
            <div className="toast-content">
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
