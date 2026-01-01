import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { KPICardProps } from '../types';
import { useApp } from '../contexts/AppContext';

const StatusCard: React.FC<KPICardProps> = ({ title, value, trend, trendUp, status, icon }) => {
  const { t } = useApp();
  
  const statusColor = 
    status === 'healthy' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' :
    status === 'attention' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900' :
    'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700';

  const iconColor = 
     status === 'healthy' ? 'text-emerald-500 dark:text-emerald-400' :
     status === 'attention' ? 'text-amber-500 dark:text-amber-400' :
     'text-slate-500 dark:text-slate-400';

  const iconBg =
     status === 'healthy' ? 'bg-emerald-100/50 dark:bg-emerald-500/10' :
     status === 'attention' ? 'bg-amber-100/50 dark:bg-amber-500/10' :
     'bg-slate-100 dark:bg-slate-800';

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          {status === 'healthy' ? t("status.healthy") : t("status.attention")}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
          {trend && (
            <span className={`flex items-center text-xs font-medium mb-1 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusHeader: React.FC = () => {
  const { t } = useApp();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatusCard 
        title={t("status.total_revenue")} 
        value="Rp 64,3 M" 
        trend="+12,5%" 
        trendUp={true} 
        status="healthy"
        icon={<TrendingUp size={22} />}
      />
      <StatusCard 
        title={t("status.active_projects")}
        value="24" 
        trend={`+3 ${t("status.new")}`}
        trendUp={true} 
        status="healthy"
        icon={<Activity size={22} />}
      />
      <StatusCard 
        title={t("status.pending_invoices")} 
        value="Rp 1,9 M" 
        trend="-2,1%" 
        trendUp={false} 
        status="attention"
        icon={<AlertCircle size={22} />}
      />
      <StatusCard 
        title={t("status.ontime_delivery")} 
        value="98,2%" 
        trend="+0,8%" 
        trendUp={true} 
        status="healthy"
        icon={<CheckCircle2 size={22} />}
      />
    </div>
  );
};

export default StatusHeader;