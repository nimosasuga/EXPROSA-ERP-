import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, Truck, AlertOctagon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const inventoryData = [
  { name: 'Baja A', stock: 4000, shipped: 2400 },
  { name: 'Tembaga W', stock: 3000, shipped: 1398 },
  { name: 'Alum X', stock: 2000, shipped: 9800 },
  { name: 'Resin P', stock: 2780, shipped: 3908 },
  { name: 'Fiber G', stock: 1890, shipped: 4800 },
  { name: 'Kaca T', stock: 2390, shipped: 3800 },
  { name: 'Karet M', stock: 3490, shipped: 4300 },
];

const MaterialWidget: React.FC = () => {
  const { theme, t } = useApp();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-all duration-300">
      
      {/* Left Info Panel */}
      <div className="lg:col-span-1 flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t("widget.mat.title")}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("widget.mat.subtitle")}</p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Package size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{t("widget.mat.total_value")}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">Rp 36 M</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{t("widget.mat.shipments_today")}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">142 Unit</p>
              </div>
            </div>

             <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex items-center gap-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <AlertOctagon size={20} />
              </div>
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium uppercase tracking-wide">{t("widget.mat.low_stock")}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t("widget.mat.low_stock_msg")}</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-indigo-900/20">
          {t("widget.mat.create_report")}
        </button>
      </div>

      {/* Right Chart Area */}
      <div className="lg:col-span-2 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={inventoryData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip 
              cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: isDark ? '1px solid #334155' : 'none', 
                backgroundColor: isDark ? '#1e293b' : '#fff',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: isDark ? '#fff' : '#000'
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b' }}
            />
            <Bar 
              dataKey="stock" 
              name={t("widget.mat.current_stock")}
              fill={isDark ? '#818cf8' : '#334155'} 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="shipped" 
              name={t("widget.mat.shipped_q3")}
              fill={isDark ? '#475569' : '#cbd5e1'} 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default MaterialWidget;