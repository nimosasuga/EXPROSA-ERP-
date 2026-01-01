import React from 'react';
import { 
  PieChart, 
  DollarSign, 
  Package, 
  Briefcase, 
  Settings, 
  Hexagon,
  LogOut,
  Wrench,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavSection } from '../types';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  collapsed?: boolean;
  toggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, collapsed = false, toggleCollapse }) => {
  const { t, user, logout } = useApp();
  
  const navItems = [
    { id: NavSection.SALES, icon: <Briefcase size={22} />, label: t("nav.sales") },
    { id: NavSection.SERVICE, icon: <Wrench size={22} />, label: t("nav.service") },
    { id: NavSection.MATERIAL, icon: <Package size={22} />, label: t("nav.material") },
    { id: NavSection.FINANCIAL, icon: <DollarSign size={22} />, label: t("nav.financial") },
    { id: NavSection.EXECUTIVE, icon: <PieChart size={22} />, label: t("nav.executive") },
  ];

  return (
    <aside 
      className={`
        h-full bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-2xl relative z-20 
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-72 lg:w-72 w-72'} 
      `}
    >
      {/* Brand Header */}
      <div className={`
        h-24 flex items-center border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-950 transition-all duration-300 relative
        ${collapsed ? 'justify-center px-0' : 'justify-between px-6'}
      `}>
        <div className="flex items-center gap-4 text-white overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
            <Hexagon size={24} fill="currentColor" className="text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 whitespace-nowrap transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            Nexus
          </span>
        </div>

        {/* Desktop Collapse Toggle */}
        {toggleCollapse && (
          <button 
            onClick={toggleCollapse}
            className={`
              hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-white hover:bg-indigo-600 transition-all absolute 
              ${collapsed ? '-right-3 top-20 shadow-md border border-slate-200 dark:border-slate-700' : 'right-4'}
            `}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* User Profile Mini (Top of Nav) */}
      <div className={`px-4 py-6 transition-all duration-300 ${collapsed ? 'items-center text-center' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
           <div className="relative">
             <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-800" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
           </div>
           {!collapsed && (
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
               <p className="text-xs text-indigo-600 dark:text-indigo-400 truncate">{user?.role} • {user?.department}</p>
             </div>
           )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        <p className={`px-4 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider mb-2 ${collapsed ? 'hidden' : 'block'}`}>Menu</p>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : ''}
              className={`
                group relative w-full flex items-center gap-4 py-3.5 rounded-2xl transition-all duration-300 ease-out
                ${collapsed ? 'justify-center px-0' : 'px-3 lg:px-4'}
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/40 translate-x-1' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white hover:translate-x-1'
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-r-full" />
              )}
              <span className={`shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className={`font-medium text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white'} ${collapsed ? 'opacity-0 w-0 overflow-hidden absolute' : 'opacity-100 relative'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm">
        <button 
           onClick={() => onNavigate(NavSection.SETTINGS)}
           title={collapsed ? t("nav.settings") : ''}
           className={`w-full flex items-center gap-4 py-3 rounded-xl transition-colors ${collapsed ? 'justify-center px-0' : 'px-3 lg:px-4'} ${activeSection === NavSection.SETTINGS ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
        >
          <Settings size={20} />
          <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{t("nav.settings")}</span>
        </button>
        
        <button 
          onClick={logout}
          title={collapsed ? t("nav.logout") : ''}
          className={`w-full flex items-center gap-4 py-3 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all rounded-xl ${collapsed ? 'justify-center px-0' : 'px-3 lg:px-4'}`}
        >
          <LogOut size={20} />
          <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;