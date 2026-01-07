import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { StatCard } from '@/components/StatCard';
import { Users, Home, FileCheck, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const serviceData = [
  { name: 'Income Cert.', value: 145 },
  { name: 'Land Record', value: 98 },
  { name: 'Birth Cert.', value: 87 },
  { name: 'Domicile', value: 76 },
  { name: 'Caste Cert.', value: 54 },
];

const trendData = [
  { month: 'Jan', services: 280 },
  { month: 'Feb', services: 315 },
  { month: 'Mar', services: 298 },
  { month: 'Apr', services: 342 },
  { month: 'May', services: 378 },
  { month: 'Jun', services: 460 },
];

const pieData = [
  { name: 'Income Certificate', value: 35 },
  { name: 'Land Records', value: 25 },
  { name: 'Birth Certificate', value: 20 },
  { name: 'Others', value: 20 },
];

const officialWorkloadData = [
  { name: 'Rajesh Gupta', services: 45 },
  { name: 'Suresh Menon', services: 38 },
  { name: 'Anita Desai', services: 52 },
];

const COLORS = ['hsl(165, 56%, 42%)', 'hsl(215, 78%, 16%)', 'hsl(215, 25%, 60%)', 'hsl(215, 15%, 75%)'];

const recentActivity = [
  { id: 1, action: 'Income Certificate Approved', user: 'Ramesh Kumar', time: '5 mins ago' },
  { id: 2, action: 'Land Record Updated', user: 'Priya Sharma', time: '12 mins ago' },
  { id: 3, action: 'Birth Certificate Issued', user: 'Amit Patel', time: '23 mins ago' },
  { id: 4, action: 'Domicile Certificate Pending', user: 'Sneha Reddy', time: '1 hour ago' },
  { id: 5, action: 'Caste Certificate Verified', user: 'Vijay Singh', time: '2 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Citizens"
                value="12,847"
                icon={Users}
                trend="+12% from last month"
                trendUp={true}
              />
              <StatCard
                title="Total Families"
                value="3,254"
                icon={Home}
                trend="+8% from last month"
                trendUp={true}
              />
              <StatCard
                title="Services Provided"
                value="1,460"
                icon={FileCheck}
                trend="+18% from last month"
                trendUp={true}
              />
              <StatCard
                title="Pending Requests"
                value="87"
                icon={Clock}
                trend="-5% from last month"
                trendUp={true}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Services by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(165, 56%, 42%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Monthly Service Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="services"
                      stroke="hsl(165, 56%, 42%)"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(165, 56%, 42%)', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Official Workload Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Official Workload</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={officialWorkloadData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="services" fill="hsl(215, 78%, 16%)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold mb-4">Most Availed Services</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="chart-container">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
