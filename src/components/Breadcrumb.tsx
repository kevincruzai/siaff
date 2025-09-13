import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    icon?: LucideIcon;
    active?: boolean;
  }>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-5">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className={`flex items-center gap-2 ${item.active ? 'text-primary-600 font-semibold' : ''}`}>
            {item.icon && (
              <item.icon className="w-4 h-4" />
            )}
            <span>{item.label}</span>
          </div>
          {index < items.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;