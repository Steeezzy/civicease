import { useAuth } from '@/contexts/AuthContext';
import { DarkModeToggle } from './DarkModeToggle';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';

export function Topbar() {
  const { officerName } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Welcome, {officerName}</h2>
        <p className="text-sm text-muted-foreground">Revenue Department Portal</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="hover:bg-accent/10">
          <Bell className="h-5 w-5" />
        </Button>
        <DarkModeToggle />
      </div>
    </header>
  );
}
