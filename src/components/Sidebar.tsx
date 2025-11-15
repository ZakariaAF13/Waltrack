import { Home, BarChart2, User, Wallet, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: 'home' | 'reports' | 'profile';
  onNavigate: (view: 'home' | 'reports' | 'profile') => void;
  lang: 'id' | 'en';
}

export const Sidebar = ({ isOpen, onToggle, activeView, onNavigate, lang }: SidebarProps) => {
  const t = {
    id: {
      dashboard: 'Dashboard',
      laporan: 'Laporan',
      profil: 'Profil',
    },
    en: {
      dashboard: 'Dashboard',
      laporan: 'Reports',
      profil: 'Profile',
    }
  };

  const menuItems = [
    { id: 'home' as const, icon: Home, label: t[lang].dashboard },
    { id: 'reports' as const, icon: BarChart2, label: t[lang].laporan },
    { id: 'profile' as const, icon: User, label: t[lang].profil },
  ];

  return (
    <>
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside
        className={cn(
          'hidden lg:block fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300 ease-in-out',
          isOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {isOpen && (
              <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-teal-600" />
                <h1 className="text-xl font-bold text-teal-600">Waltrack</h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn('lg:flex', !isOpen && 'mx-auto')}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  activeView === item.id && 'bg-teal-600 hover:bg-teal-700 text-white',
                  !isOpen && 'lg:justify-center'
                )}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <item.icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                © 2025 Waltrack
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
