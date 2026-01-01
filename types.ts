import React from 'react';

export interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  status?: 'healthy' | 'attention' | 'critical';
  icon?: React.ReactNode;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  secondaryValue?: number;
  tertiaryValue?: number;
}

export interface ProjectMilestone {
  id: string;
  project: string;
  client: string;
  status: 'In Progress' | 'Completed' | 'Delayed' | 'Review';
  progress: number;
  dueDate: string;
}

export enum NavSection {
  EXECUTIVE = 'EXECUTIVE',
  FINANCIAL = 'FINANCIAL',
  MATERIAL = 'MATERIAL',
  SALES = 'SALES',
  SERVICE = 'SERVICE',
  SETTINGS = 'SETTINGS'
}

// --- Auth & RBAC Types ---

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'FINANCE' | 'WAREHOUSE' | 'MARKETING' | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}