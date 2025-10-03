import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title = "Sistema Clínico", subtitle = "Gestión y carga de registros médicos" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-slate-900">{title}</h1>
          <p className="text-slate-600">{subtitle}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
}