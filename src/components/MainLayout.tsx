import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerPinned, setHeaderPinned] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleHeaderPin = () => setHeaderPinned(!headerPinned);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Container for sticky header and scrollable content */}
        <div className="flex-1 overflow-auto">
          {/* Top bar with conditional positioning */}
          <div className={`transition-all duration-300 ${
            headerPinned 
              ? 'sticky top-0 z-50 shadow-xl backdrop-blur-md bg-white/90' 
              : 'relative z-10'
          }`}>
            <TopBar 
              onMenuToggle={toggleSidebar} 
              onTogglePin={toggleHeaderPin}
              isPinned={headerPinned}
            />
          </div>
          
          {/* Content */}
          <main className="min-h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;