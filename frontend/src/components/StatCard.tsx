import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-blue-500 mb-1">{title}</span>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default StatCard;