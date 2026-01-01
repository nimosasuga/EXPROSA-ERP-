import React, { useState } from 'react';
import { NavSection } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { Menu } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { user } = useApp(); // Access auth state
  const [activeSection, setActiveSection] = useState<NavSection>(NavSection.EXECUTIVE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardResetKey, setDashboardResetKey] = useState(0);

  const handleNavigation = (section: NavSection) => {
    if (activeSection === section) {
      setDashboardResetKey(prev => prev + 1);
    } else {
      setActiveSection(section);
      setDashboardResetKey(0);
    }
    setMobileMenuOpen(false);
  };

  // Logic: Show Login if no user
  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        bg-slate-900 dark:bg-slate-950
      `}>
        <Sidebar 
          activeSection={activeSection} 
          onNavigate={handleNavigation}
          collapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 shrink-0">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800 dark:text-white">Nexus ERP</span>
        </div>

        {/* Scrollable Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <Dashboard activeSection={activeSection} resetKey={dashboardResetKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;