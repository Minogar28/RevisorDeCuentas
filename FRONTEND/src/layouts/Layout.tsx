import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title = 'Sistema Clínico - Gestión y carga de registros médicos' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-slate-200 flex-none">
        <div className="max-w-7xl mx-auto px-1 py-4">
          <h1 className="text-slate-900">{title}</h1>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <div className="max-w-7xl mx-auto p-6 h-full overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
