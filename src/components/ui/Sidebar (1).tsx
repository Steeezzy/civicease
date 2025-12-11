import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Home, FileText, BarChart3, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function Sidebar() {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Citizens', path: '/citizens' },
    { icon: Home, label: 'Families', path: '/families' },
    { icon: FileText, label: 'Services', path: '/services' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-sidebar-background border-r border-sidebar-border h-screen flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
        <div className={isCollapsed ? 'hidden' : 'block'}>
          <h1 className="text-xl font-bold text-sidebar-foreground">CivicEase</h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Digital Governance Portal</p>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:text-sidebar-primary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                title={item.label}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          title="Logout"
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
