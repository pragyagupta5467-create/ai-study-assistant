import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function StatCard({ label, value, subtext, icon: Icon, color, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon-box" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="stat-trend-badge">
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-bottom">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtext && <div className="stat-subtext">{subtext}</div>}
      </div>
    </div>
  );
}
