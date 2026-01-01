import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, NavSection } from '../types';

type Theme = 'light' | 'dark' | 'system';
type Language = 'id' | 'en';

// Extended permission types based on the Matrix
type ActionType = 'create' | 'read' | 'edit' | 'delete' | 'approve' | 'view_sensitive' | 'setup_access';
type ResourceType = string; // NavSection
type SubScopeType = 'setup' | 'operation' | 'report' | 'any';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  // Auth
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  // Advanced RBAC: Action, Resource (Module), SubScope (Setup/Ops/Report)
  canPerform: (action: ActionType, resource: ResourceType, subScope?: SubScopeType) => boolean;
}

// --- MOCK USERS DATA (Updated with AUDITOR) ---
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alexandra Hamilton',
    email: 'owner@nexus.com',
    role: 'OWNER',
    department: 'Board of Directors',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
  },
  {
    id: 'u2',
    name: 'Budi Santoso',
    email: 'manager@nexus.com',
    role: 'MANAGER',
    department: 'Operations',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
  },
  {
    id: 'u3',
    name: 'Sarah Jenkins',
    email: 'staff@nexus.com',
    role: 'STAFF',
    department: 'General Staff',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d'
  },
  {
    id: 'u4',
    name: 'Dimas Finance',
    email: 'finance@nexus.com',
    role: 'FINANCE',
    department: 'Accounting & Tax',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026305d'
  },
  {
    id: 'u5',
    name: 'Wawan Gudang',
    email: 'warehouse@nexus.com',
    role: 'WAREHOUSE',
    department: 'Logistics & Inventory',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026309d'
  },
  {
    id: 'u6',
    name: 'Maya Marketing',
    email: 'marketing@nexus.com',
    role: 'MARKETING',
    department: 'Sales & Growth',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e290263011'
  },
  {
    id: 'u7',
    name: 'Robert Audit',
    email: 'auditor@nexus.com',
    role: 'AUDITOR',
    department: 'Internal Audit',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e290263033'
  }
];

const translations = {
  id: {
    // Navigation & General
    "nav.executive": "Analisis Eksekutif",
    "nav.financial": "Manajemen Keuangan",
    "nav.material": "Manajemen Material",
    "nav.sales": "Manajemen Penjualan",
    "nav.service": "Manajemen Layanan",
    "nav.settings": "Pengaturan",
    "nav.logout": "Keluar Sesi",
    "header.welcome": "Nexus ERP Enterprise",
    "header.search": "Cari data transaksi, aset, atau modul...",
    "header.back": "Kembali ke",
    "settings.contact_admin": "Hubungi IT Support untuk akses.",
    "status.completed": "Selesai",
    "status.in_progress": "Berjalan",
    "status.review": "Tinjauan",
    "status.delayed": "Tertunda",
    "status.total_revenue": "Total Pendapatan",
    "status.active_projects": "Proyek Aktif",
    "status.pending_invoices": "Tagihan Tertunda",
    "status.ontime_delivery": "Pengiriman Tepat Waktu",
    "status.healthy": "Sehat",
    "status.attention": "Perhatian",
    "status.new": "Baru",
    
    // Widgets
    "widget.fin.title": "Kinerja Keuangan",
    "widget.fin.subtitle": "Arus Kas & Pengeluaran",
    "widget.fin.all": "Semua",
    "widget.fin.cash_flow": "Arus Kas",
    "widget.fin.expenses": "Pengeluaran",
    "widget.fin.op_expenses": "Biaya Ops",
    "widget.sales.title": "Proyek Aktif",
    "widget.sales.subtitle": "Status & Pencapaian",
    "widget.sales.progress": "Progres",
    "widget.sales.deadline": "Tenggat:",
    "widget.sales.view_all": "Lihat Semua Proyek",
    "widget.mat.title": "Inventaris",
    "widget.mat.subtitle": "Level Stok & Pergerakan",
    "widget.mat.total_value": "Nilai Total",
    "widget.mat.shipments_today": "Pengiriman Hari Ini",
    "widget.mat.low_stock": "Stok Rendah",
    "widget.mat.low_stock_msg": "3 Item Perlu Restock",
    "widget.mat.create_report": "Buat Laporan Stok",
    "widget.mat.current_stock": "Stok Saat Ini",
    "widget.mat.shipped_q3": "Terkirim Q3",
    
    // Module Categories
    "module.setup": "Konfigurasi",
    "module.operation": "Operasional",
    "module.report": "Laporan",

    // SALES Modules
    "mod.sales.case.title": "Manajemen Kasus",
    "mod.sales.case.desc": "Pusat bantuan pelanggan & tiket.",
    "mod.sales.case.op1": "Buat Tiket Baru",
    "mod.sales.case.op2": "Lihat Tiket Aktif",
    "mod.sales.case.rep1": "Laporan SLA",

    "mod.sales.pipeline.title": "Pipeline Penjualan",
    "mod.sales.pipeline.desc": "Pelacakan prospek & peluang.",
    "mod.sales.pipeline.op1": "Lihat Pipeline",
    "mod.sales.pipeline.op2": "Tambah Prospek",
    "mod.sales.pipeline.rep1": "Laporan Konversi",

    "mod.sales.orders.title": "Pesanan Penjualan",
    "mod.sales.orders.desc": "Pemrosesan pesanan pelanggan.",
    "mod.sales.orders.op1": "Buat Pesanan",
    "mod.sales.orders.op2": "Kelola Pesanan",
    "mod.sales.orders.rep1": "Riwayat Penjualan",

    // SERVICE Modules
    "mod.service.proj.title": "Manajemen Proyek",
    "mod.service.proj.desc": "Perencanaan & pelacakan proyek.",
    "mod.service.proj.set1": "Pengaturan Proyek",
    "mod.service.proj.op1": "Buat Proyek Baru",
    "mod.service.proj.op2": "Proyek Berjalan",
    "mod.service.proj.rep1": "Laporan Progres",

    "mod.service.field.title": "Layanan Lapangan",
    "mod.service.field.desc": "Jadwal teknisi & pengiriman.",
    "mod.service.field.set1": "Keahlian Teknisi",
    "mod.service.field.op1": "Jadwal Penugasan",
    "mod.service.field.rep1": "Laporan Utilisasi",

    "mod.service.maint.title": "Pemeliharaan",
    "mod.service.maint.desc": "Jadwal servis aset & peralatan.",
    "mod.service.maint.set1": "Rencana Servis",
    "mod.service.maint.op1": "Perintah Kerja (WO)",
    "mod.service.maint.rep1": "Kesehatan Aset",

    "mod.service.expense.title": "Manajemen Biaya",
    "mod.service.expense.desc": "Klaim & pelacakan biaya staf.",
    "mod.service.expense.set1": "Aturan Biaya",
    "mod.service.expense.op1": "Ajukan Klaim",
    "mod.service.expense.op2": "Persetujuan Klaim",

    "mod.service.time.title": "Manajemen Waktu",
    "mod.service.time.desc": "Absensi & lembar waktu kerja.",
    "mod.service.time.op1": "Timesheet Saya",
    "mod.service.time.op2": "Persetujuan Waktu",
    "mod.service.time.rep1": "Biaya Tenaga Kerja",

    // MATERIAL Modules
    "mod.mat.inv.title": "Inventaris",
    "mod.mat.inv.desc": "Level stok & penyesuaian.",
    "mod.mat.inv.set1": "Konfigurasi Gudang",
    "mod.mat.inv.op1": "Penyesuaian Stok",
    "mod.mat.inv.op2": "Daftar Stok Master",

    "mod.mat.ship.title": "Pengiriman & Penerimaan",
    "mod.mat.ship.desc": "Logistik masuk & keluar.",
    "mod.mat.ship.op1": "Buat Pengiriman",
    "mod.mat.ship.op2": "Terima Barang",
    "mod.mat.ship.rep1": "Log Pengiriman",

    "mod.mat.purch.title": "Pembelian (Purchasing)",
    "mod.mat.purch.desc": "Vendor & pesanan pembelian.",
    "mod.mat.purch.set1": "Daftar Vendor",
    "mod.mat.purch.op1": "Pesanan Pembelian (PO)",
    "mod.mat.purch.op2": "Buat PO Baru",

    "mod.mat.data.title": "Koleksi Data",
    "mod.mat.data.desc": "Input barcode & data lapangan.",
    "mod.mat.data.op1": "Scan Barang",
    "mod.mat.data.op2": "Entri Batch",
    "mod.mat.data.rep1": "Log Pemindaian",

    // FINANCIAL Modules
    "mod.fin.ar.title": "Piutang Usaha (AR)",
    "mod.fin.ar.desc": "Tagihan pelanggan & penagihan.",
    "mod.fin.ar.op1": "Kelola Faktur",
    "mod.fin.ar.op2": "Buat Faktur",

    "mod.fin.ap.title": "Hutang Usaha (AP)",
    "mod.fin.ap.desc": "Tagihan vendor & pembayaran.",
    "mod.fin.ap.op1": "Kelola Tagihan",
    "mod.fin.ap.op2": "Input Tagihan",

    "mod.fin.asset.title": "Aset Tetap",
    "mod.fin.asset.desc": "Pelacakan & depresiasi aset.",
    "mod.fin.asset.set1": "Daftar Aset",
    "mod.fin.asset.op1": "Jalan Depresiasi",

    "mod.fin.cash.title": "Manajemen Kas",
    "mod.fin.cash.desc": "Rekening bank & arus kas.",
    "mod.fin.cash.op1": "Posisi Kas",
    "mod.fin.cash.rep1": "Laporan Arus Kas",

    // Settings
    "settings.clock": "Waktu Sistem",
    "settings.appearance": "Tampilan",
    "settings.appearance_desc": "Sesuaikan antarmuka sistem.",
    "settings.theme_light": "Terang",
    "settings.theme_light_desc": "Tampilan bersih klasik",
    "settings.theme_dark": "Gelap",
    "settings.theme_dark_desc": "Nyaman untuk mata",
    "settings.theme_system": "Sistem",
    "settings.theme_system_desc": "Ikuti pengaturan OS",
    "settings.lang_region": "Bahasa & Wilayah",
    "settings.lang_region_desc": "Format tanggal dan bahasa.",
    "settings.lang_id": "Bahasa Indonesia",
    "settings.lang_id_region": "Format ID (DD/MM/YYYY)",
    "settings.lang_en": "English (US)",
    "settings.lang_en_region": "US Format (MM/DD/YYYY)",
    "settings.device": "Informasi Perangkat",
    "settings.device_desc": "Detail sesi perangkat saat ini.",
    "settings.browser": "Browser",
    "settings.os": "Sistem Operasi",
    "settings.version": "Versi Sistem",
    "settings.not_configured": "Modul Belum Dikonfigurasi",
    
    // Messages
    "Record saved successfully": "Data berhasil disimpan ke server.",
    "Permission Denied": "Akses Ditolak"
  },
  en: {
    // Navigation & General
    "nav.executive": "Executive Analysis",
    "nav.financial": "Financial Management",
    "nav.material": "Material Management",
    "nav.sales": "Sales Management",
    "nav.service": "Service Management",
    "nav.settings": "Settings",
    "nav.logout": "Sign Out",
    "header.welcome": "Nexus ERP Enterprise",
    "header.search": "Search transactions, assets, or modules...",
    "header.back": "Back to",
    "settings.contact_admin": "Contact IT Support for access.",
    "status.completed": "Completed",
    "status.in_progress": "In Progress",
    "status.review": "Review",
    "status.delayed": "Delayed",
    "status.total_revenue": "Total Revenue",
    "status.active_projects": "Active Projects",
    "status.pending_invoices": "Pending Invoices",
    "status.ontime_delivery": "On-time Delivery",
    "status.healthy": "Healthy",
    "status.attention": "Attention",
    "status.new": "New",

    // Widgets
    "widget.fin.title": "Financial Performance",
    "widget.fin.subtitle": "Cash Flow & Expenses",
    "widget.fin.all": "All",
    "widget.fin.cash_flow": "Cash Flow",
    "widget.fin.expenses": "Expenses",
    "widget.fin.op_expenses": "Op. Expenses",
    "widget.sales.title": "Active Projects",
    "widget.sales.subtitle": "Status & Milestones",
    "widget.sales.progress": "Progress",
    "widget.sales.deadline": "Due:",
    "widget.sales.view_all": "View All Projects",
    "widget.mat.title": "Inventory Overview",
    "widget.mat.subtitle": "Stock Levels & Movement",
    "widget.mat.total_value": "Total Value",
    "widget.mat.shipments_today": "Shipments Today",
    "widget.mat.low_stock": "Low Stock",
    "widget.mat.low_stock_msg": "3 Items Need Restock",
    "widget.mat.create_report": "Create Stock Report",
    "widget.mat.current_stock": "Current Stock",
    "widget.mat.shipped_q3": "Shipped Q3",

    // Module Categories
    "module.setup": "Setup",
    "module.operation": "Operations",
    "module.report": "Reports",

    // SALES Modules
    "mod.sales.case.title": "Case Management",
    "mod.sales.case.desc": "Handle customer issues and tickets.",
    "mod.sales.case.op1": "Create Ticket",
    "mod.sales.case.op2": "View Tickets",
    "mod.sales.case.rep1": "SLA Report",

    "mod.sales.pipeline.title": "Sales Pipeline",
    "mod.sales.pipeline.desc": "Track leads and opportunities.",
    "mod.sales.pipeline.op1": "View Pipeline",
    "mod.sales.pipeline.op2": "Add Lead",
    "mod.sales.pipeline.rep1": "Conversion Report",

    "mod.sales.orders.title": "Sales Orders",
    "mod.sales.orders.desc": "Manage customer orders.",
    "mod.sales.orders.op1": "Create Order",
    "mod.sales.orders.op2": "Manage Orders",
    "mod.sales.orders.rep1": "Sales History",

    // SERVICE Modules
    "mod.service.proj.title": "Project Management",
    "mod.service.proj.desc": "Plan and track projects.",
    "mod.service.proj.set1": "Project Settings",
    "mod.service.proj.op1": "Create Project",
    "mod.service.proj.op2": "Active Projects",
    "mod.service.proj.rep1": "Progress Report",

    "mod.service.field.title": "Field Service",
    "mod.service.field.desc": "Manage technicians and dispatch.",
    "mod.service.field.set1": "Technician Skills",
    "mod.service.field.op1": "Dispatch Schedule",
    "mod.service.field.rep1": "Utilization Report",

    "mod.service.maint.title": "Maintenance",
    "mod.service.maint.desc": "Equipment maintenance schedules.",
    "mod.service.maint.set1": "Maintenance Plans",
    "mod.service.maint.op1": "Work Orders",
    "mod.service.maint.rep1": "Equipment Health",

    "mod.service.expense.title": "Expense Management",
    "mod.service.expense.desc": "Track employee expenses.",
    "mod.service.expense.set1": "Expense Rules",
    "mod.service.expense.op1": "Submit Claim",
    "mod.service.expense.op2": "Approve Claims",

    "mod.service.time.title": "Time Management",
    "mod.service.time.desc": "Timesheets and attendance.",
    "mod.service.time.op1": "My Timesheet",
    "mod.service.time.op2": "Approve Timesheets",
    "mod.service.time.rep1": "Labor Costs",

    // MATERIAL Modules
    "mod.mat.inv.title": "Inventory",
    "mod.mat.inv.desc": "Stock levels and adjustments.",
    "mod.mat.inv.set1": "Warehouse Config",
    "mod.mat.inv.op1": "Stock Adjustment",
    "mod.mat.inv.op2": "Master Stock List",

    "mod.mat.ship.title": "Shipping & Receiving",
    "mod.mat.ship.desc": "Inbound and outbound logistics.",
    "mod.mat.ship.op1": "Create Shipment",
    "mod.mat.ship.op2": "Receive Goods",
    "mod.mat.ship.rep1": "Shipment Log",

    "mod.mat.purch.title": "Purchasing",
    "mod.mat.purch.desc": "Vendor management and POs.",
    "mod.mat.purch.set1": "Vendor List",
    "mod.mat.purch.op1": "Purchase Orders",
    "mod.mat.purch.op2": "Create PO",

    "mod.mat.data.title": "Data Collection",
    "mod.mat.data.desc": "Barcode scanning and entry.",
    "mod.mat.data.op1": "Scan Item",
    "mod.mat.data.op2": "Batch Entry",
    "mod.mat.data.rep1": "Scan Logs",

    // FINANCIAL Modules
    "mod.fin.ar.title": "Accounts Receivable",
    "mod.fin.ar.desc": "Invoices and collections.",
    "mod.fin.ar.op1": "Manage Invoices",
    "mod.fin.ar.op2": "Create Invoice",

    "mod.fin.ap.title": "Accounts Payable",
    "mod.fin.ap.desc": "Bills and payments.",
    "mod.fin.ap.op1": "Manage Bills",
    "mod.fin.ap.op2": "Enter Bill",

    "mod.fin.asset.title": "Asset Management",
    "mod.fin.asset.desc": "Fixed assets tracking.",
    "mod.fin.asset.set1": "Asset Register",
    "mod.fin.asset.op1": "Depreciation Run",

    "mod.fin.cash.title": "Cash Management",
    "mod.fin.cash.desc": "Bank accounts and cash flow.",
    "mod.fin.cash.op1": "Cash Positioning",
    "mod.fin.cash.rep1": "Cash Flow Stmt",

    // Settings
    "settings.clock": "System Clock",
    "settings.appearance": "Appearance",
    "settings.appearance_desc": "Customize the interface look.",
    "settings.theme_light": "Light",
    "settings.theme_light_desc": "Classic clean look",
    "settings.theme_dark": "Dark",
    "settings.theme_dark_desc": "Easy on the eyes",
    "settings.theme_system": "System",
    "settings.theme_system_desc": "Follow OS settings",
    "settings.lang_region": "Language & Region",
    "settings.lang_region_desc": "Date formats and locale.",
    "settings.lang_id": "Bahasa Indonesia",
    "settings.lang_id_region": "Format ID (DD/MM/YYYY)",
    "settings.lang_en": "English (US)",
    "settings.lang_en_region": "US Format (MM/DD/YYYY)",
    "settings.device": "Device Information",
    "settings.device_desc": "Current session details.",
    "settings.browser": "Browser",
    "settings.os": "Operating System",
    "settings.version": "System Version",
    "settings.not_configured": "Module Not Configured",
    
    // Messages
    "Record saved successfully": "Record saved successfully to server.",
    "Permission Denied": "Permission Denied"
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const login = (email: string) => {
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // --- ADVANCED RBAC ENGINE (Matrix Implementation) ---
  const canPerform = (
    action: ActionType, 
    resource: ResourceType, 
    subScope: SubScopeType = 'any'
  ): boolean => {
    if (!user) return false;

    // 1. OWNER: Global God Mode
    if (user.role === 'OWNER') return true;

    // 2. AUDITOR: Global Read Only
    if (user.role === 'AUDITOR') {
      return action === 'read' || action === 'view_sensitive';
    }

    // 3. EXECUTIVE MODULE (Special Case)
    if (resource === NavSection.EXECUTIVE) {
      // Only Owner and Managers can see Executive Dashboards
      if (action === 'read') return ['OWNER', 'MANAGER', 'FINANCE'].includes(user.role);
      return false;
    }

    // 4. MANAGER (Department Level)
    if (user.role === 'MANAGER') {
      // Full Access in their "Concept" department (Assuming Manager has access to everything for demo simplicity, 
      // in real app we check user.department === resource)
      return true; 
    }

    // 5. ROLE-SPECIFIC LOGIC (Staff/Specialist Roles)

    // --- SETUP / CONFIGURATION (Matrix: Staff usually denied) ---
    if (subScope === 'setup' || action === 'setup_access') {
      // Only Owner/Manager allows setup. Specific Roles might allow setup in their module?
      // Matrix says: Staff = No Access to Setup.
      return false;
    }

    // --- REPORTS (Matrix: Restricted for Staff) ---
    if (subScope === 'report' || action === 'view_sensitive') {
      // Finance sees Finance Reports
      if (user.role === 'FINANCE' && resource === NavSection.FINANCIAL) return true;
      // Marketing sees Sales Reports
      if (user.role === 'MARKETING' && resource === NavSection.SALES) return true;
      // Warehouse sees Material Reports (Non-Financial)
      if (user.role === 'WAREHOUSE' && resource === NavSection.MATERIAL && action !== 'view_sensitive') return true;
      
      // General Staff cannot see reports usually
      return false;
    }

    // --- APPROVALS (Matrix: Manager Only usually) ---
    if (action === 'approve') {
      if (user.role === 'FINANCE' && resource === NavSection.FINANCIAL) return true; // Finance approves payments
      // Warehouse might approve Stock Adjustments (Edge case)
      if (user.role === 'WAREHOUSE' && resource === NavSection.MATERIAL) return true;
      return false;
    }

    // --- DELETE (Matrix: Very Restricted) ---
    if (action === 'delete') {
      if (user.role === 'MARKETING' && resource === NavSection.SALES) return true; // Marketing can delete Leads
      if (user.role === 'WAREHOUSE' && resource === NavSection.MATERIAL) return true; // Warehouse can delete draft GRPO
      if (user.role === 'FINANCE' && resource === NavSection.FINANCIAL) return true; // Finance can void draft invoices
      return false;
    }

    // --- CREATE / EDIT / READ (General Operations) ---
    // At this point, we are in 'operation' scope or 'any'.
    
    // FINANCE Role
    if (user.role === 'FINANCE') {
      if (resource === NavSection.FINANCIAL) return true;
      // Read-only elsewhere
      return action === 'read';
    }

    // WAREHOUSE Role
    if (user.role === 'WAREHOUSE') {
      if (resource === NavSection.MATERIAL) return true;
      return action === 'read';
    }

    // MARKETING Role
    if (user.role === 'MARKETING') {
      if (resource === NavSection.SALES) return true;
      return action === 'read';
    }

    // STAFF Role (General)
    if (user.role === 'STAFF') {
      // Matrix: Staff can Read & Create/Update in Ops, but not Approve/Delete/Setup
      // Assuming 'STAFF' is assigned to Service/General tasks in this demo context
      if (resource === NavSection.SERVICE) return ['read', 'create', 'edit'].includes(action);
      
      // Staff has Read-only on others (e.g. Material availability)
      return action === 'read';
    }

    return false;
  };

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ 
      theme, setTheme, language, setLanguage, t,
      user, login, logout, canPerform
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};