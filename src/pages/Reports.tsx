import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Printer, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const mostRequestedServices = [
  { name: 'Income Certificate', count: 145 },
  { name: 'Land Record', count: 98 },
  { name: 'Birth Certificate', count: 87 },
  { name: 'Domicile', count: 76 },
  { name: 'Caste Certificate', count: 54 },
];

const topFamilies = [
  { family: 'Kumar Family', services: 12 },
  { family: 'Sharma Family', services: 10 },
  { family: 'Patel Family', services: 9 },
  { family: 'Singh Family', services: 8 },
  { family: 'Reddy Family', services: 7 },
];

const yearlyDistribution = [
  { month: 'Jan', services: 280, families: 45 },
  { month: 'Feb', services: 315, families: 52 },
  { month: 'Mar', services: 298, families: 48 },
  { month: 'Apr', services: 342, families: 58 },
  { month: 'May', services: 378, families: 62 },
  { month: 'Jun', services: 460, families: 71 },
];

export default function Reports() {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleDownload = () => {
    alert('Report download functionality will be implemented with backend integration');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground mt-1">Statistical insights and data trends</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Summary
                </Button>
              </div>
            </div>

            {/* Date Range Filter */}
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium">Filter by Date Range:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PP') : 'From Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>
                <span className="text-muted-foreground">to</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PP') : 'To Date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </Card>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Requested Services */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Most Requested Services</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mostRequestedServices}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(165, 56%, 42%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Top Families by Service Count */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Families by Service Count</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topFamilies} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="family" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
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
              </Card>
            </div>

            {/* Yearly Distribution - Combined Bar and Line Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Yearly Distribution (Services & Families)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={yearlyDistribution}>
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
                  <Bar dataKey="services" fill="hsl(165, 56%, 42%)" radius={[8, 8, 0, 0]} name="Services" />
                  <Line
                    type="monotone"
                    dataKey="families"
                    stroke="hsl(215, 78%, 16%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(215, 78%, 16%)', r: 5 }}
                    name="Families"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
