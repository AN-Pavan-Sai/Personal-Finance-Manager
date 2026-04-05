import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  gradient: string;
  delay?: number;
}

export default function KPICard({ title, value, icon, trend, gradient, delay = 0 }: KPICardProps) {
  return (
    <div
      className="glass-light rounded-2xl p-8 animate-fade-in hover:scale-[1.02] transition-transform duration-300 cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {trend && (
            <p className="text-xs mt-2 text-accent-emerald font-medium">{trend}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
