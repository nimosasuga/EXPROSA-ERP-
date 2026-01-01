import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NavSection } from '../types';
import StatusHeader from './StatusHeader';
import FinancialWidget from './FinancialWidget';
import MaterialWidget from './MaterialWidget';
import SalesWidget from './SalesWidget';
import { useApp } from '../contexts/AppContext';
import { 
  Search, Bell, Calendar, ChevronRight, ArrowLeft, 
  Layers, Users, FileText, Settings, Truck, Clipboard, 
  BarChart3, ScanLine, ShoppingCart, UserCheck, HardHat,
  Database, Globe, Moon, Sun, Monitor, Check, Smartphone,
  Clock, Hammer, DollarSign, Briefcase, Plus, Filter, Download, 
  MoreHorizontal, X, Save, Printer, Share2, History, File as FileIcon,
  Activity, CreditCard, Box, Mail, Trash2, AlertTriangle, UploadCloud,
  CheckCircle2, AlertCircle, ShieldCheck, XCircle
} from 'lucide-react';

// --- Types & Interfaces ---

interface DashboardProps {
  activeSection: NavSection;
  resetKey?: number;
}

interface SubModuleAction {
  id: string;
  name: string;
  type: 'setup' | 'operation' | 'report';
}

interface SubModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: SubModuleAction[];
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// --- Mock Data Interfaces ---

interface HistoryLog {
  date: string;
  action: string;
  user: string;
  type: 'update' | 'create' | 'delete' | 'system' | 'approve' | 'reject';
}

interface DocumentFile {
  id: string;
  name: string;
  size: string;
  date: string;
  type: string;
}

interface FinancialRecord {
  id: string;
  desc: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
}

interface DetailRecord {
  id: string;
  [key: string]: any;
  history?: HistoryLog[];
  documents?: DocumentFile[];
  financials?: FinancialRecord[];
}

interface MockData {
  type: 'table' | 'form' | 'kpi';
  title: string;
  columns?: { header: string; accessor: string }[];
  data?: DetailRecord[];
  fields?: string[];
}

// --- Utils ---

const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
};

const Dashboard: React.FC<DashboardProps> = ({ activeSection, resetKey }) => {
  const { theme, setTheme, language, setLanguage, t, user, canPerform } = useApp();
  
  // Navigation State
  const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);
  const [selectedAction, setSelectedAction] = useState<SubModuleAction | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DetailRecord | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // UI State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [subModuleSearch, setSubModuleSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Toast System ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // --- Data Helpers ---
  const generateHistory = (id: string): HistoryLog[] => [
    { date: '2023-10-25 14:30', action: 'System synchronization complete', user: 'System', type: 'system' },
    { date: '2023-10-25 09:15', action: 'Data validated', user: 'Manager', type: 'approve' },
    { date: '2023-10-24 16:00', action: 'Record created', user: 'Staff', type: 'create' },
  ];

  const generateDocs = (id: string): DocumentFile[] => [
    { id: '1', name: `Doc_${id}_Primary.pdf`, size: '1.2 MB', date: '2023-10-24', type: 'PDF' },
    { id: '2', name: 'Supporting_Data.xlsx', size: '450 KB', date: '2023-10-24', type: 'XLSX' },
  ];

  const generateFinancials = (id: string): FinancialRecord[] => [
    { id: 'TRX-001', desc: 'Allocation', amount: 'Rp 10.000.000', status: 'Paid', date: '2023-10-24' },
    { id: 'TRX-002', desc: 'Cost Adjustment', amount: 'Rp 2.500.000', status: 'Pending', date: '2023-10-30' },
  ];

  // --- MOCK DATABASE ---
  const MOCK_DB: Record<string, MockData> = useMemo(() => ({
    // SALES
    'sales-case-op2': {
      type: 'table',
      title: t("mod.sales.case.op2"),
      columns: [
        { header: 'Case ID', accessor: 'id' },
        { header: 'Subject', accessor: 'subject' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Status', accessor: 'status' },
        { header: 'Priority', accessor: 'priority' },
      ],
      data: [
        { id: 'CS-001', subject: 'Login Failure', customer: 'PT Tekno', status: 'Open', priority: 'High', date: '2023-10-25', history: generateHistory('CS01'), documents: generateDocs('CS01') },
        { id: 'CS-002', subject: 'Billing Inquiry', customer: 'Global Log', status: 'Closed', priority: 'Medium', date: '2023-10-24', history: generateHistory('CS02'), documents: generateDocs('CS02') },
      ]
    },
    'sales-order-op2': {
      type: 'table',
      title: t("mod.sales.orders.op2"),
      columns: [{ header: 'SO #', accessor: 'id' }, { header: 'Customer', accessor: 'customer' }, { header: 'Total', accessor: 'total' }, { header: 'Status', accessor: 'status' }],
      data: [
        { id: 'SO-1001', customer: 'Retail ID', total: 'Rp 45.000.000', status: 'Confirmed', date: '2023-10-20', history: generateHistory('SO1'), financials: generateFinancials('SO1') },
        { id: 'SO-1002', customer: 'Tech Corp', total: 'Rp 120.000.000', status: 'Pending', date: '2023-10-21', history: generateHistory('SO2'), financials: generateFinancials('SO2') },
      ]
    },

    // SERVICE
    'svc-proj-op2': {
       type: 'table',
       title: t("mod.service.proj.op2"),
       columns: [{ header: 'Project ID', accessor: 'id' }, { header: 'Name', accessor: 'name' }, { header: 'Client', accessor: 'client' }, { header: 'Progress', accessor: 'progress' }, { header: 'Status', accessor: 'status' }],
       data: [
         { id: 'PRJ-Alpha', name: 'ERP Implementation', client: 'PT Maju', progress: '75%', status: 'In Progress', date: '2023-12-01', history: generateHistory('P1'), documents: generateDocs('P1') },
         { id: 'PRJ-Beta', name: 'Cloud Migration', client: 'CV Sejahtera', progress: '30%', status: 'Delayed', date: '2023-11-15', history: generateHistory('P2'), documents: generateDocs('P2') },
       ]
    },
    'svc-field-op1': {
       type: 'table',
       title: t("mod.service.field.op1"),
       columns: [{ header: 'Ticket #', accessor: 'id' }, { header: 'Technician', accessor: 'tech' }, { header: 'Location', accessor: 'loc' }, { header: 'Time', accessor: 'time' }],
       data: [
         { id: 'TKT-991', tech: 'Ahmad S.', loc: 'Jakarta Selatan', time: '10:00 AM', status: 'Scheduled', date: '2023-10-27', history: generateHistory('T1') },
         { id: 'TKT-992', tech: 'Budi P.', loc: 'Bekasi Barat', time: '02:00 PM', status: 'Completed', date: '2023-10-26', history: generateHistory('T2') },
       ]
    },

    // MATERIAL
    'mat-inv-op2': {
      type: 'table',
      title: t("mod.mat.inv.op2"),
      columns: [{ header: 'SKU', accessor: 'id' }, { header: 'Name', accessor: 'name' }, { header: 'Stock', accessor: 'stock' }, { header: 'Unit', accessor: 'unit' }, { header: 'Location', accessor: 'loc' }],
      data: [
        { id: 'M-101', name: 'Steel Sheet 5mm', stock: '500', unit: 'Sheet', loc: 'WH-A', status: 'Available', date: '-', history: generateHistory('M1'), financials: generateFinancials('M1') },
        { id: 'M-102', name: 'Copper Wire 2mm', stock: '1200', unit: 'Roll', loc: 'WH-B', status: 'Low Stock', date: '-', history: generateHistory('M2'), financials: generateFinancials('M2') },
        { id: 'M-103', name: 'Industrial Resin', stock: '40', unit: 'Drum', loc: 'WH-C', status: 'Available', date: '-', history: generateHistory('M3'), financials: generateFinancials('M3') },
      ]
    },
    'mat-purch-op1': {
       type: 'table',
       title: t("mod.mat.purch.op1"),
       columns: [{ header: 'PO #', accessor: 'id' }, { header: 'Vendor', accessor: 'vendor' }, { header: 'Amount', accessor: 'amount' }, { header: 'Status', accessor: 'status' }],
       data: [
         { id: 'PO-5001', vendor: 'Steel Suppliers Inc', amount: 'Rp 250.000.000', status: 'Approved', date: '2023-10-22', history: generateHistory('PO1'), financials: generateFinancials('PO1') },
         { id: 'PO-5002', vendor: 'Chem Indo PT', amount: 'Rp 45.000.000', status: 'Draft', date: '2023-10-26', history: generateHistory('PO2'), financials: generateFinancials('PO2') },
       ]
    },

    // FINANCIAL
    'fin-ar-op1': {
       type: 'table',
       title: t("mod.fin.ar.op1"),
       columns: [{ header: 'Inv #', accessor: 'id' }, { header: 'Customer', accessor: 'cust' }, { header: 'Amount', accessor: 'amount' }, { header: 'Due Date', accessor: 'due' }, { header: 'Status', accessor: 'status' }],
       data: [
         { id: 'INV-2023-001', cust: 'Client A', amount: 'Rp 15.000.000', due: '2023-11-01', status: 'Unpaid', date: '2023-10-01', history: generateHistory('INV1'), financials: generateFinancials('INV1') },
         { id: 'INV-2023-002', cust: 'Client B', amount: 'Rp 8.000.000', due: '2023-11-05', status: 'Paid', date: '2023-10-05', history: generateHistory('INV2'), financials: generateFinancials('INV2') },
       ]
    },
    'fin-ap-op1': {
      type: 'table',
      title: t("mod.fin.ap.op1"),
       columns: [{ header: 'Bill #', accessor: 'id' }, { header: 'Vendor', accessor: 'vendor' }, { header: 'Amount', accessor: 'amount' }, { header: 'Due Date', accessor: 'due' }, { header: 'Status', accessor: 'status' }],
       data: [
         { id: 'BILL-901', vendor: 'Vendor X', amount: 'Rp 5.000.000', due: '2023-10-30', status: 'Unpaid', date: '2023-10-10', history: generateHistory('BILL1'), financials: generateFinancials('BILL1') },
       ]
    },
    'fin-asset-set1': {
      type: 'table',
      title: t("mod.fin.asset.set1"),
      columns: [{ header: 'Asset ID', accessor: 'id' }, { header: 'Name', accessor: 'name' }, { header: 'Category', accessor: 'cat' }, { header: 'Value', accessor: 'val' }],
      data: [
        { id: 'AST-001', name: 'Office Building A', cat: 'Real Estate', val: 'Rp 5 M', status: 'Active', date: '2020-01-01', history: generateHistory('AST1'), financials: generateFinancials('AST1') },
      ]
    },

    // Default Fallback
    'default': {
      type: 'table',
      title: 'Data Overview',
      columns: [{ header: 'ID', accessor: 'id' }, { header: 'Description', accessor: 'desc' }, { header: 'Date', accessor: 'date' }, { header: 'Status', accessor: 'status' }],
      data: [
        { id: 'REC-001', desc: 'Sample Data Record Alpha', date: '2023-10-26', status: 'Active', history: generateHistory('D1'), documents: generateDocs('D1') },
        { id: 'REC-002', desc: 'Sample Data Record Beta', date: '2023-10-25', status: 'Pending', history: generateHistory('D2'), documents: generateDocs('D2') },
      ]
    }
  }), [t]);

  // --- MODULE DEFINITIONS (Populated Fully) ---
  const moduleData: Record<string, SubModule[]> = useMemo(() => ({
    [NavSection.SALES]: [
      {
        id: 'case-mgmt',
        title: t("mod.sales.case.title"),
        description: t("mod.sales.case.desc"),
        icon: <Users size={24} className="text-blue-500" />,
        actions: [
          { id: 'sales-case-op1', name: t("mod.sales.case.op1"), type: 'operation' },
          { id: 'sales-case-op2', name: t("mod.sales.case.op2"), type: 'operation' },
          { id: 'sales-case-rep1', name: t("mod.sales.case.rep1"), type: 'report' }
        ]
      },
      {
        id: 'pipeline',
        title: t("mod.sales.pipeline.title"),
        description: t("mod.sales.pipeline.desc"),
        icon: <BarChart3 size={24} className="text-purple-500" />,
        actions: [
          { id: 'sales-pipe-op1', name: t("mod.sales.pipeline.op1"), type: 'operation' },
          { id: 'sales-pipe-op2', name: t("mod.sales.pipeline.op2"), type: 'operation' },
          { id: 'sales-pipe-rep1', name: t("mod.sales.pipeline.rep1"), type: 'report' }
        ]
      },
      {
        id: 'orders',
        title: t("mod.sales.orders.title"),
        description: t("mod.sales.orders.desc"),
        icon: <ShoppingCart size={24} className="text-emerald-500" />,
        actions: [
          { id: 'sales-order-op1', name: t("mod.sales.orders.op1"), type: 'operation' },
          { id: 'sales-order-op2', name: t("mod.sales.orders.op2"), type: 'operation' },
          { id: 'sales-order-rep1', name: t("mod.sales.orders.rep1"), type: 'report' }
        ]
      }
    ],
    [NavSection.SERVICE]: [
      {
        id: 'proj-mgmt',
        title: t("mod.service.proj.title"),
        description: t("mod.service.proj.desc"),
        icon: <Briefcase size={24} className="text-indigo-500" />,
        actions: [
          { id: 'svc-proj-set1', name: t("mod.service.proj.set1"), type: 'setup' },
          { id: 'svc-proj-op1', name: t("mod.service.proj.op1"), type: 'operation' },
          { id: 'svc-proj-op2', name: t("mod.service.proj.op2"), type: 'operation' }, // Mapped to Mock
          { id: 'svc-proj-rep1', name: t("mod.service.proj.rep1"), type: 'report' }
        ]
      },
      {
        id: 'field-svc',
        title: t("mod.service.field.title"),
        description: t("mod.service.field.desc"),
        icon: <UserCheck size={24} className="text-cyan-500" />,
        actions: [
          { id: 'svc-field-set1', name: t("mod.service.field.set1"), type: 'setup' },
          { id: 'svc-field-op1', name: t("mod.service.field.op1"), type: 'operation' }, // Mapped to Mock
          { id: 'svc-field-rep1', name: t("mod.service.field.rep1"), type: 'report' }
        ]
      },
      {
        id: 'maint',
        title: t("mod.service.maint.title"),
        description: t("mod.service.maint.desc"),
        icon: <Hammer size={24} className="text-orange-500" />,
        actions: [
          { id: 'svc-maint-set1', name: t("mod.service.maint.set1"), type: 'setup' },
          { id: 'svc-maint-op1', name: t("mod.service.maint.op1"), type: 'operation' },
          { id: 'svc-maint-rep1', name: t("mod.service.maint.rep1"), type: 'report' }
        ]
      },
      {
        id: 'expense',
        title: t("mod.service.expense.title"),
        description: t("mod.service.expense.desc"),
        icon: <DollarSign size={24} className="text-green-500" />,
        actions: [
          { id: 'svc-exp-set1', name: t("mod.service.expense.set1"), type: 'setup' },
          { id: 'svc-exp-op1', name: t("mod.service.expense.op1"), type: 'operation' },
          { id: 'svc-exp-op2', name: t("mod.service.expense.op2"), type: 'operation' }
        ]
      },
      {
        id: 'time',
        title: t("mod.service.time.title"),
        description: t("mod.service.time.desc"),
        icon: <Clock size={24} className="text-pink-500" />,
        actions: [
          { id: 'svc-time-op1', name: t("mod.service.time.op1"), type: 'operation' },
          { id: 'svc-time-op2', name: t("mod.service.time.op2"), type: 'operation' },
          { id: 'svc-time-rep1', name: t("mod.service.time.rep1"), type: 'report' }
        ]
      }
    ],
    [NavSection.MATERIAL]: [
      {
        id: 'inventory',
        title: t("mod.mat.inv.title"),
        description: t("mod.mat.inv.desc"),
        icon: <Layers size={24} className="text-amber-500" />,
        actions: [
          { id: 'mat-inv-set1', name: t("mod.mat.inv.set1"), type: 'setup' },
          { id: 'mat-inv-op1', name: t("mod.mat.inv.op1"), type: 'operation' },
          { id: 'mat-inv-op2', name: t("mod.mat.inv.op2"), type: 'operation' } // Mapped to Mock
        ]
      },
      {
        id: 'shipping',
        title: t("mod.mat.ship.title"),
        description: t("mod.mat.ship.desc"),
        icon: <Truck size={24} className="text-blue-600" />,
        actions: [
          { id: 'mat-ship-op1', name: t("mod.mat.ship.op1"), type: 'operation' },
          { id: 'mat-ship-op2', name: t("mod.mat.ship.op2"), type: 'operation' },
          { id: 'mat-ship-rep1', name: t("mod.mat.ship.rep1"), type: 'report' }
        ]
      },
      {
        id: 'purchase',
        title: t("mod.mat.purch.title"),
        description: t("mod.mat.purch.desc"),
        icon: <ShoppingCart size={24} className="text-teal-600" />,
        actions: [
          { id: 'mat-purch-set1', name: t("mod.mat.purch.set1"), type: 'setup' },
          { id: 'mat-purch-op1', name: t("mod.mat.purch.op1"), type: 'operation' }, // Mapped
          { id: 'mat-purch-op2', name: t("mod.mat.purch.op2"), type: 'operation' }
        ]
      },
      {
        id: 'data-coll',
        title: t("mod.mat.data.title"),
        description: t("mod.mat.data.desc"),
        icon: <ScanLine size={24} className="text-rose-500" />,
        actions: [
          { id: 'mat-data-op1', name: t("mod.mat.data.op1"), type: 'operation' },
          { id: 'mat-data-op2', name: t("mod.mat.data.op2"), type: 'operation' },
          { id: 'mat-data-rep1', name: t("mod.mat.data.rep1"), type: 'report' }
        ]
      }
    ],
    [NavSection.FINANCIAL]: [
      {
        id: 'ar',
        title: t("mod.fin.ar.title"),
        description: t("mod.fin.ar.desc"),
        icon: <FileText size={24} className="text-emerald-600" />,
        actions: [
          { id: 'fin-ar-op1', name: t("mod.fin.ar.op1"), type: 'operation' }, // Mapped
          { id: 'fin-ar-op2', name: t("mod.fin.ar.op2"), type: 'operation' }
        ]
      },
      {
        id: 'ap',
        title: t("mod.fin.ap.title"),
        description: t("mod.fin.ap.desc"),
        icon: <Clipboard size={24} className="text-rose-600" />,
        actions: [
          { id: 'fin-ap-op1', name: t("mod.fin.ap.op1"), type: 'operation' }, // Mapped
          { id: 'fin-ap-op2', name: t("mod.fin.ap.op2"), type: 'operation' }
        ]
      },
      {
        id: 'asset',
        title: t("mod.fin.asset.title"),
        description: t("mod.fin.asset.desc"),
        icon: <Database size={24} className="text-slate-600" />,
        actions: [
          { id: 'fin-asset-set1', name: t("mod.fin.asset.set1"), type: 'setup' }, // Mapped
          { id: 'fin-asset-op1', name: t("mod.fin.asset.op1"), type: 'operation' }
        ]
      },
      {
        id: 'cash',
        title: t("mod.fin.cash.title"),
        description: t("mod.fin.cash.desc"),
        icon: <DollarSign size={24} className="text-yellow-600" />,
        actions: [
          { id: 'fin-cash-op1', name: t("mod.fin.cash.op1"), type: 'operation' }, 
          { id: 'fin-cash-rep1', name: t("mod.fin.cash.rep1"), type: 'report' }
        ]
      }
    ]
  }), [t]);

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSelectedSubModule(null);
    setSelectedAction(null);
    setSelectedRecord(null);
    setActiveTab('overview');
    setSubModuleSearch('');
  }, [activeSection, resetKey]);

  useEffect(() => {
    setSubModuleSearch('');
    setSelectedAction(null);
    setSelectedRecord(null);
  }, [selectedSubModule]);

  // Handlers
  const handleRecordClick = (record: DetailRecord) => {
    setIsLoading(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setSelectedRecord(record);
      setActiveTab('overview');
      setIsLoading(false);
    }, 400);
  };

  const handleSave = () => {
    // Check permission with activeSection context
    if (!canPerform('edit', activeSection)) {
       addToast("Permission Denied: Edit access required for this module.", 'error');
       return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast(t("Record saved successfully"), 'success');
      // Update history mock
      if (selectedRecord) {
        selectedRecord.history?.unshift({
          date: new Date().toLocaleString(),
          action: 'Record updated manually',
          user: user?.name || 'Unknown',
          type: 'update'
        });
      }
    }, 1200);
  };

  const handleDelete = () => {
    // Check permission with activeSection context
    if (!canPerform('delete', activeSection)) {
      addToast("Permission Denied: You cannot delete records in this module.", 'error');
      return;
    }
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
       addToast("Record moved to trash", 'info');
       setSelectedRecord(null); // Go back to list
    }
  };

  const handleApproval = (status: 'Approved' | 'Rejected') => {
    // Check permission with activeSection context
    if (!canPerform('approve', activeSection)) {
      addToast("Permission Denied: Approval role required for this module.", 'error');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (selectedRecord) {
        // Mutate mock object directly for demo purposes
        selectedRecord.status = status === 'Approved' ? 'Completed' : 'Review'; // Map to visual status
        selectedRecord.history?.unshift({
          date: new Date().toLocaleString(),
          action: `Record ${status} by ${user?.name}`,
          user: user?.name || 'Unknown',
          type: status === 'Approved' ? 'approve' : 'reject'
        });
      }
      addToast(`Record ${status}`, status === 'Approved' ? 'success' : 'error');
    }, 1000);
  };

  const handleEmail = () => {
    addToast("Email report sent to " + user?.email, 'success');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getSectionTitle = (section: string) => {
    switch(section) {
      case NavSection.SALES: return t("nav.sales");
      case NavSection.SERVICE: return t("nav.service");
      case NavSection.MATERIAL: return t("nav.material");
      case NavSection.FINANCIAL: return t("nav.financial");
      case NavSection.EXECUTIVE: return t("nav.executive");
      case NavSection.SETTINGS: return t("nav.settings");
      default: return section;
    }
  }

  // --- Render Components ---

  const renderToast = () => (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-full duration-300 ${
          toast.type === 'success' ? 'bg-white dark:bg-slate-800 border-emerald-500 text-emerald-600' :
          toast.type === 'error' ? 'bg-white dark:bg-slate-800 border-rose-500 text-rose-600' :
          'bg-white dark:bg-slate-800 border-blue-500 text-blue-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : toast.type === 'error' ? <AlertCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium text-slate-800 dark:text-white">{toast.message}</span>
        </div>
      ))}
    </div>
  );

  const renderHeader = () => (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-slate-400 dark:text-slate-500 text-sm mb-1">
          <span className="cursor-default hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {t("header.welcome")}
          </span>
          <ChevronRight size={14} />
          <button 
            onClick={() => { setSelectedSubModule(null); setSelectedAction(null); setSelectedRecord(null); }}
            className={`hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${selectedSubModule ? 'text-slate-400 dark:text-slate-500' : 'text-indigo-600 dark:text-indigo-400 font-medium'}`}
          >
            {getSectionTitle(activeSection)}
          </button>
          
          {selectedSubModule && (
            <>
              <ChevronRight size={14} />
              <button
                 onClick={() => { setSelectedAction(null); setSelectedRecord(null); }}
                 className={`hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${selectedAction ? 'text-slate-400 dark:text-slate-500' : 'text-indigo-600 dark:text-indigo-400 font-medium'}`}
              >
                {selectedSubModule.title}
              </button>
            </>
          )}

          {selectedAction && (
            <>
              <ChevronRight size={14} />
              <button
                onClick={() => setSelectedRecord(null)}
                className={`hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${selectedRecord ? 'text-slate-400 dark:text-slate-500' : 'text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer'}`}
              >
                {selectedAction.name}
              </button>
            </>
          )}

          {selectedRecord && (
             <>
               <ChevronRight size={14} />
               <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-default">
                 {selectedRecord.id}
               </span>
             </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {selectedRecord ? (selectedRecord.name || selectedRecord.subject || selectedRecord.id) : (selectedAction ? selectedAction.name : (selectedSubModule ? selectedSubModule.title : getSectionTitle(activeSection)))}
        </h1>
      </div>
      
      {activeSection !== NavSection.SETTINGS && (
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t("header.search")}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-72 shadow-sm transition-all text-slate-900 dark:text-white"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 shadow-sm">
            <Calendar size={18} className="text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-semibold">
              {currentTime.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      )}
    </header>
  );

  // --- Main Render Switch ---

  // 1. Settings Page
  if (activeSection === NavSection.SETTINGS) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {renderHeader()}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Clock */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-900 dark:to-violet-950 rounded-3xl p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
              <div className="flex items-center gap-3 text-indigo-100">
                <Clock className="w-6 h-6" />
                <span className="text-sm font-medium tracking-wide uppercase">{t("settings.clock")}</span>
              </div>
              <div>
                <div className="text-6xl lg:text-7xl font-bold tracking-tight font-mono tabular-nums mb-2">
                  {currentTime.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { hour12: false })}
                </div>
                <div className="text-xl text-indigo-100 font-light">
                  {currentTime.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-white/20 flex gap-4 text-xs font-medium text-indigo-200">
                <span>User: {user?.name} ({user?.role})</span>
              </div>
            </div>
          </div>
          
          {/* Card 2: Appearance */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t("settings.appearance")}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t("settings.appearance_desc")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'light', icon: Sun, label: t("settings.theme_light"), desc: t("settings.theme_light_desc"), color: 'amber' },
                { id: 'dark', icon: Moon, label: t("settings.theme_dark"), desc: t("settings.theme_dark_desc"), color: 'indigo' },
                { id: 'system', icon: Monitor, label: t("settings.theme_system"), desc: t("settings.theme_system_desc"), color: 'slate' }
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setTheme(opt.id as any)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    theme === opt.id ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-sm ${theme === opt.id ? 'bg-white dark:bg-slate-800 text-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
                    <opt.icon size={20} />
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">{opt.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</div>
                  {theme === opt.id && <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400"><Check size={18} /></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Card 3: Language (Restored) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors">
            <div className="flex items-center gap-3 mb-1">
               <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                 <Globe size={20} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("settings.lang_region")}</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 ml-11">{t("settings.lang_region_desc")}</p>
            <div className="space-y-3">
              {[
                { id: 'id', label: t("settings.lang_id"), sub: t("settings.lang_id_region"), flag: "🇮🇩" },
                { id: 'en', label: t("settings.lang_en"), sub: t("settings.lang_en_region"), flag: "🇺🇸" }
              ].map(lang => (
                 <button
                   key={lang.id}
                   onClick={() => setLanguage(lang.id as 'id' | 'en')}
                   className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                     language === lang.id 
                     ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-sm' 
                     : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <span className="text-3xl drop-shadow-sm">{lang.flag}</span>
                     <div className="text-left">
                       <div className="font-bold text-slate-900 dark:text-white">{lang.label}</div>
                       <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{lang.sub}</div>
                     </div>
                   </div>
                   {language === lang.id && (
                     <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                       <Check size={16} strokeWidth={3} />
                     </div>
                   )}
                 </button>
              ))}
            </div>
          </div>

          {/* Card 4: Device Info (New filler) */}
           <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                 <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                    <Smartphone size={20} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("settings.device")}</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 ml-11">{t("settings.device_desc")}</p>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3">
                       <Monitor className="text-slate-400" size={18} />
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("settings.browser")}</span>
                    </div>
                    <span className="text-sm text-slate-500 font-mono">Chrome 120.0</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-3">
                       <HardHat className="text-slate-400" size={18} /> 
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("settings.os")}</span>
                    </div>
                    <span className="text-sm text-slate-500 font-mono">Windows 11 Pro</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                     <div className="flex items-center gap-3">
                       <Activity className="text-slate-400" size={18} />
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t("settings.version")}</span>
                    </div>
                    <span className="text-sm text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">v3.5.0-production</span>
                 </div>
              </div>
           </div>

        </div>
      </div>
    );
  }

  // 2. Dashboard Executive
  if (activeSection === NavSection.EXECUTIVE) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {renderHeader()}
        <StatusHeader />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 h-[450px]">
            <FinancialWidget />
          </div>
          <div className="xl:col-span-1 h-[450px]">
            <SalesWidget />
          </div>
          <div className="xl:col-span-3">
            <MaterialWidget />
          </div>
        </div>
      </div>
    );
  }

  // 3. Record Detail View (Level 4 & 5)
  if (selectedRecord && selectedAction) {
    const tabs = ['Overview', 'Activity', 'Financials', 'Documents', 'Settings'];
    
    return (
      <div className="animate-in slide-in-from-right-8 duration-300 pb-12">
        {renderToast()}
        {renderHeader()}
        
        <button 
          onClick={() => setSelectedRecord(null)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} />
          {t("header.back")} {selectedAction.name}
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[700px] flex flex-col">
           {/* Header */}
           <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex gap-6">
                 <div className="w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-100 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-50 dark:border-slate-700 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Database size={40} />
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedRecord.id}</h2>
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          ['Paid', 'Completed', 'Confirmed', 'Approved'].includes(selectedRecord.status) ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900' :
                          ['Unpaid', 'Open', 'Pending', 'In Progress'].includes(selectedRecord.status) ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900' :
                          'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                       }`}>
                          {selectedRecord.status || 'Active'}
                       </span>
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-300 font-medium mb-1">
                      {selectedRecord.name || selectedRecord.subject || selectedRecord.desc || 'Record Detail'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                       <span className="flex items-center gap-1.5"><Calendar size={14}/> {selectedRecord.date || selectedRecord.due || 'N/A'}</span>
                       {selectedRecord.location && <span className="flex items-center gap-1.5"><Globe size={14}/> {selectedRecord.location}</span>}
                    </div>
                 </div>
              </div>
              <div className="flex gap-3 self-end lg:self-auto">
                 <button onClick={handleEmail} className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50">
                    <Mail size={20} />
                 </button>
                 <button className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50">
                    <Printer size={20} />
                 </button>
                 {canPerform('delete', activeSection) && (
                    <button onClick={handleDelete} className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50">
                        <Trash2 size={20} />
                    </button>
                 )}
                 {canPerform('edit', activeSection) && (
                    <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70"
                    >
                        {isSaving ? <Activity className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                 )}
              </div>
           </div>

           {/* Tabs */}
           <div className="px-8 border-b border-slate-100 dark:border-slate-800 flex gap-8 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                 <button 
                   key={tab}
                   onClick={() => handleTabChange(tab.toLowerCase())}
                   className={`py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.toLowerCase() 
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                   }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>

           {/* Content */}
           <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50 flex-1">
              
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="lg:col-span-2 space-y-6">
                       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                             <FileText size={16} className="text-indigo-500" /> General Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                             {Object.entries(selectedRecord).map(([key, value], idx) => {
                                if (['id', 'status', 'history', 'documents', 'financials'].includes(key)) return null;
                                return (
                                   <div key={idx} className="space-y-1">
                                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{key.replace(/_/g, ' ')}</label>
                                      <div className="font-medium text-slate-900 dark:text-white break-words">{String(value)}</div>
                                   </div>
                                )
                             })}
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Quick Actions</h3>
                          <div className="space-y-3">
                             <button className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 text-left flex items-center gap-3 transition-colors">
                                <CreditCard size={18} className="text-indigo-500" /> Process Payment
                             </button>
                             <button className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 text-left flex items-center gap-3 transition-colors">
                                <Box size={18} className="text-emerald-500" /> Check Inventory
                             </button>
                             <button className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 text-left flex items-center gap-3 transition-colors">
                                <History size={18} className="text-amber-500" /> View Audit Log
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {/* TAB: ACTIVITY */}
              {activeTab === 'activity' && (
                <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8 py-2">
                    {selectedRecord.history?.map((log, idx) => (
                      <div key={idx} className="relative pl-8 group">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                          log.type === 'create' ? 'bg-emerald-500' :
                          log.type === 'delete' ? 'bg-rose-500' :
                          log.type === 'approve' ? 'bg-blue-500' :
                          log.type === 'reject' ? 'bg-red-500' :
                          log.type === 'system' ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}></div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-shadow">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">{log.action}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">by <span className="font-semibold text-indigo-600 dark:text-indigo-400">{log.user}</span></p>
                          </div>
                          <span className="text-xs font-mono text-slate-400 mt-2 sm:mt-0">{log.date}</span>
                        </div>
                      </div>
                    ))}
                    <div className="relative pl-8">
                       <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"></div>
                       <p className="text-xs text-slate-400 italic">End of history log.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DOCUMENTS */}
              {activeTab === 'documents' && (
                 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                      <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Attached Files ({selectedRecord.documents?.length || 0})</h3>
                      <button onClick={() => addToast("File picker opened", 'info')} className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors">
                        <UploadCloud size={14} /> Upload New
                      </button>
                    </div>
                    {selectedRecord.documents?.map(doc => (
                       <div key={doc.id} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                <FileIcon size={20} />
                             </div>
                             <div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">{doc.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{doc.size} • {doc.date} • {doc.type}</p>
                             </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => addToast("Downloading file...", 'info')} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg">
                                <Download size={16} />
                             </button>
                             {canPerform('delete', activeSection) && (
                                <button className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg">
                                    <Trash2 size={16} />
                                </button>
                             )}
                          </div>
                       </div>
                    ))}
                    {(!selectedRecord.documents || selectedRecord.documents.length === 0) && (
                      <div className="p-12 text-center text-slate-400">No documents found.</div>
                    )}
                 </div>
              )}

              {/* TAB: FINANCIALS */}
              {activeTab === 'financials' && (
                 canPerform('view_sensitive', activeSection) ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRecord.financials?.map(fin => (
                                <tr key={fin.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{fin.id}</td>
                                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{fin.desc}</td>
                                    <td className="p-4 text-sm text-slate-500">{fin.date}</td>
                                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white text-right">{fin.amount}</td>
                                    <td className="p-4 text-center">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${
                                        fin.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        {fin.status}
                                    </span>
                                    </td>
                                </tr>
                                ))}
                                {(!selectedRecord.financials || selectedRecord.financials.length === 0) && (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No financial records linked.</td></tr>
                                )}
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-900 dark:bg-indigo-950 rounded-2xl p-6 text-white shadow-lg">
                            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Value</h4>
                            <p className="text-3xl font-bold font-mono">Rp 20.000.000</p>
                            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-sm">
                            <span className="text-emerald-400">Paid: Rp 15.000.000</span>
                            <span className="text-amber-400">Pending: Rp 5.000.000</span>
                            </div>
                        </div>
                    </div>
                    </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Access Restricted</h3>
                        <p className="text-sm">You do not have permission to view sensitive financial data.</p>
                     </div>
                 )
              )}

              {/* TAB: SETTINGS & APPROVAL */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                   
                   {/* Approval Section */}
                   <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Approval Workflow</h3>
                      <p className="text-sm text-slate-500 mb-6">Current record status: <span className="font-bold text-indigo-600">{selectedRecord.status || 'Active'}</span></p>
                      
                      {canPerform('approve', activeSection) ? (
                          <div className="flex gap-4">
                              <button onClick={() => handleApproval('Approved')} disabled={isSaving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                                  <CheckCircle2 size={18} /> Approve
                              </button>
                              <button onClick={() => handleApproval('Rejected')} disabled={isSaving} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                                  <XCircle size={18} /> Reject
                              </button>
                          </div>
                      ) : (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center gap-3 text-slate-500 text-sm">
                              <ShieldCheck size={18} />
                              Approval actions are restricted to Managers (or Module Owners).
                          </div>
                      )}
                   </div>

                   <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Record Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Bell size={18} /></div>
                             <div>
                               <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                               <p className="text-xs text-slate-500">Receive updates when this record changes</p>
                             </div>
                           </div>
                           <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                      </div>
                   </div>

                   {/* Danger Zone */}
                   {canPerform('delete', activeSection) ? (
                       <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 p-6">
                            <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-2">
                                <AlertTriangle size={18} /> Danger Zone
                            </h3>
                            <p className="text-sm text-rose-600/80 mb-4">Actions here can result in data loss. Be careful.</p>
                            <div className="flex gap-4">
                                <button onClick={handleDelete} className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-50 transition-colors">Archive Record</button>
                                <button onClick={handleDelete} className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors shadow-sm">Delete Permanently</button>
                            </div>
                        </div>
                   ) : (
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 opacity-60">
                            <h3 className="font-bold text-slate-500 mb-2 flex items-center gap-2">
                                <AlertTriangle size={18} /> Danger Zone
                            </h3>
                            <p className="text-sm text-slate-400">Restricted to Owner or Module Specific Role only.</p>
                        </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  // 4. Sub-Module List View (Level 3)
  if (selectedAction) {
    // FALLBACK LOGIC: If specific mock doesn't exist, try to find a generic one based on type, or default
    const dbData = MOCK_DB[selectedAction.id] || (
       selectedAction.type === 'report' ? { ...MOCK_DB['default'], title: selectedAction.name } :
       MOCK_DB['default']
    );
    
    // Override title if falling back to default, to make it look specific
    const displayData = { ...dbData, title: dbData.title === 'Data Overview' ? selectedAction.name : dbData.title };
    
    return (
      <div className="animate-in slide-in-from-right-8 duration-300 pb-12">
        {renderHeader()}
        <button onClick={() => setSelectedAction(null)} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft size={16} /> {t("header.back")} {selectedSubModule?.title}
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50">
             <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className={`p-2 rounded-lg ${selectedAction.type === 'setup' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                 {selectedAction.type === 'setup' ? <Settings size={20} /> : <Layers size={20} />}
               </div>
               <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{displayData.title}</span>
             </div>
             <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
               {displayData.type === 'table' && (
                 <>
                   <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"><Filter size={16} /> Filter</button>
                   <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"><Download size={16} /> Export</button>
                   {canPerform('create', activeSection) && (
                     <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm whitespace-nowrap"><Plus size={16} /> New</button>
                   )}
                 </>
               )}
             </div>
          </div>

          <div className="p-0 flex-1 bg-slate-50/30 dark:bg-slate-900/50">
            {displayData.type === 'table' && displayData.columns && displayData.data ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {displayData.columns.map((col, idx) => (
                        <th key={idx} className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap">{col.header}</th>
                      ))}
                      <th className="p-4 text-right w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.data.map((row, rIdx) => (
                      <tr key={rIdx} onClick={() => handleRecordClick(row)} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group">
                        {displayData.columns!.map((col, cIdx) => (
                          <td key={cIdx} className="p-4 text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
                            {row[col.accessor]}
                          </td>
                        ))}
                        <td className="p-4 text-right"><button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><MoreHorizontal size={18} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400"><Database size={48} className="mb-4 opacity-50" /><p>No data available.</p></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 5. Sub-Module Landing (Level 2) & Default Cards
  const currentSubModules = moduleData[activeSection] || [];
  if (selectedSubModule) {
    const filteredActions = selectedSubModule.actions.filter(a => a.name.toLowerCase().includes(subModuleSearch.toLowerCase()));
    return (
       <div className="animate-in slide-in-from-right-8 duration-300 pb-12">
        {renderHeader()}
        <button onClick={() => setSelectedSubModule(null)} className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> {t("header.back")} {getSectionTitle(activeSection)}
        </button>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-50/50 dark:bg-slate-800/50 p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">{selectedSubModule.icon}</div>
              <div><h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedSubModule.title}</h2><p className="text-slate-500 dark:text-slate-400 max-w-2xl">{selectedSubModule.description}</p></div>
            </div>
            <div className="relative w-full md:w-72 shrink-0">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" value={subModuleSearch} onChange={(e) => setSubModuleSearch(e.target.value)} placeholder={t("header.search")} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2"><Settings size={14} /> {t("module.setup")}</div>
              {filteredActions.filter(a => a.type === 'setup').map((action, idx) => (
                <button key={idx} onClick={() => setSelectedAction(action)} className="w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-100 dark:border-slate-700 hover:border-indigo-100 transition-all group">
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">{action.name}</span>
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2"><Layers size={14} /> {t("module.operation")}</div>
              {filteredActions.filter(a => a.type === 'operation').map((action, idx) => (
                <button key={idx} onClick={() => setSelectedAction(action)} className="w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-white">{action.name}</span><ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                </button>
              ))}
            </div>
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2"><FileText size={14} /> {t("module.report")}</div>
               {filteredActions.filter(a => a.type === 'report').map((action, idx) => (
                <button key={idx} onClick={() => setSelectedAction(action)} className="w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-100 dark:border-slate-700 hover:border-emerald-100 transition-all group">
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
       </div>
    );
  }

  // Default: Grid View Level 1
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {renderHeader()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSubModules.map((subModule) => (
          <button key={subModule.id} onClick={() => setSelectedSubModule(subModule)} className="group relative flex flex-col items-start p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900/30 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative mb-6 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group-hover:bg-indigo-600 transition-colors duration-300">
              <div className="text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-300">{subModule.icon}</div>
            </div>
            <h3 className="relative text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{subModule.title}</h3>
            <p className="relative text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{subModule.description}</p>
          </button>
        ))}
      </div>
      {currentSubModules.length === 0 && (
         <div className="flex flex-col items-center justify-center h-96 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4"><Settings size={32} className="text-slate-300 dark:text-slate-600" /></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t("settings.not_configured")}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mt-2">{t("settings.contact_admin")} {getSectionTitle(activeSection)}.</p>
         </div>
      )}
    </div>
  );
};

export default Dashboard;