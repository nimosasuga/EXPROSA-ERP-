import React from 'react';
import { ProjectMilestone } from '../types';
import { Clock, CheckCircle2, AlertTriangle, MoreVertical } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const milestones: ProjectMilestone[] = [
  { id: '1', project: 'Implementasi Alpha', client: 'PT TeknoFlow', status: 'In Progress', progress: 75, dueDate: '28 Okt' },
  { id: '2', project: 'Migrasi Cloud', client: 'Logistik Global', status: 'Review', progress: 90, dueDate: '02 Nov' },
  { id: '3', project: 'Upgrade ERP v2', client: 'Apex Manu', status: 'Delayed', progress: 45, dueDate: '25 Okt' },
  { id: '4', project: 'Audit Keamanan', client: 'FinServe', status: 'Completed', progress: 100, dueDate: '20 Okt' },
  { id: '5', project: 'Analitik Data', client: 'Ritel Inti', status: 'In Progress', progress: 30, dueDate: '15 Nov' },
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useApp();

  const styles = 
    status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' :
    status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900' :
    status === 'Review' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900' :
    'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900';

  const label = 
    status === 'Completed' ? t("status.completed") :
    status === 'In Progress' ? t("status.in_progress") :
    status === 'Review' ? t("status.review") :
    t("status.delayed");

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles}`}>
      {label}
    </span>
  );
};

const SalesWidget: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 h-full flex flex-col transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("widget.sales.title")}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("widget.sales.subtitle")}</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {milestones.map((item) => (
          <div key={item.id} className="group p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{item.project}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.client}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t("widget.sales.progress")}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.status === 'Completed' ? 'bg-emerald-500' :
                    item.status === 'Delayed' ? 'bg-rose-500' :
                    item.status === 'Review' ? 'bg-amber-500' :
                    'bg-indigo-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 justify-end">
                <Clock size={12} className="text-slate-400" />
                <span className={`text-xs font-medium ${
                    item.status === 'Delayed' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {t("widget.sales.deadline")} {item.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 border-dashed">
        {t("widget.sales.view_all")}
      </button>
    </div>
  );
};

export default SalesWidget;