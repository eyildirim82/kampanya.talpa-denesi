import React from 'react';
import { ApplicationStatus } from '../types';

interface BadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getStatusStyle = (s: string) => {
    switch (s) {
      case ApplicationStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case ApplicationStatus.PENDING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ApplicationStatus.WAITING:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case ApplicationStatus.APPROVED:
        return 'Onaylandı';
      case ApplicationStatus.REJECTED:
        return 'Reddedildi';
      case ApplicationStatus.PENDING:
        return 'Değerlendiriliyor';
      case ApplicationStatus.WAITING:
        return 'Belge Bekleniyor';
      default:
        return s;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusStyle(status)} ${className}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default Badge;