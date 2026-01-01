import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const data = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'Mei', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 },
  { name: 'Agu', income: 4200, expenses: 3100 },
  { name: 'Sep', income: 5100, expenses: 4600 },
  { name: 'Okt', income: 6100, expenses: 5200 },
];

const FinancialWidget: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1Y');
  const { theme, t } = useApp();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 h-full flex flex-col transition-all duration-300">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("widget.fin.title")}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("widget.fin.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-100 dark:border-slate-700">
            {['1M', '6M', '1Y', t("widget.fin.all")].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? '#94a3b8' : '#94a3b8', fontSize: 11 }} 
              dy={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              width={48}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: isDark ? '#94a3b8' : '#94a3b8', fontSize: 11 }} 
              tickFormatter={(value) => `Rp${value/1000}M`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: isDark ? '1px solid #334155' : 'none', 
                backgroundColor: isDark ? '#1e293b' : '#fff',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: isDark ? '#fff' : '#000'
              }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              formatter={(value: number) => [`Rp ${value} Juta`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              name={t("widget.fin.cash_flow")}
              stroke="#0f766e" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name={t("widget.fin.expenses")}
              stroke="#1e3a8a" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center gap-12 sm:gap-16 border-t border-slate-50 dark:border-slate-800 pt-4 shrink-0">
        <div className="flex items-start gap-3">
          <span className="w-3 h-3 mt-1.5 rounded-full bg-teal-700 shadow-sm shadow-teal-700/50"></span>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t("widget.fin.cash_flow")}</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Rp 45,2 M 
              <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-md font-semibold">+4,2%</span>
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="w-3 h-3 mt-1.5 rounded-full bg-blue-900 shadow-sm shadow-blue-900/50"></span>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t("widget.fin.op_expenses")}</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Rp 32,1 M 
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs px-1.5 py-0.5 rounded-md font-semibold">-1,2%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialWidget;