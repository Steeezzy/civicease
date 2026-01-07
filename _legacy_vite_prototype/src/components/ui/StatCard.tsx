import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-success' : 'text-destructive'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent" />
        </div>
      </div>
    </div>
  );
}
