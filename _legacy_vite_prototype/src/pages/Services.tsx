import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { initialOfficials } from './Officials';

interface Service {
  id: string;
  serviceName: string;
  citizenOrFamily: string;
  date: string;
  remarks: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  officialResponsible: string;
}

const initialServices: Service[] = [
  { id: 'SRV001', serviceName: 'Income Certificate', citizenOrFamily: 'Ramesh Kumar', date: '2025-01-15', remarks: 'Annual income verification', status: 'Approved', officialResponsible: 'Rajesh Gupta' },
  { id: 'SRV002', serviceName: 'Land Record Update', citizenOrFamily: 'Priya Sharma', date: '2025-01-18', remarks: 'Ownership transfer', status: 'Pending', officialResponsible: 'Suresh Menon' },
  { id: 'SRV003', serviceName: 'Birth Certificate', citizenOrFamily: 'Amit Patel', date: '2025-01-20', remarks: 'New registration', status: 'Completed', officialResponsible: 'Anita Desai' },
  { id: 'SRV004', serviceName: 'Domicile Certificate', citizenOrFamily: 'Sneha Reddy', date: '2025-01-22', remarks: 'State residence proof', status: 'Approved', officialResponsible: 'Rajesh Gupta' },
  { id: 'SRV005', serviceName: 'Caste Certificate', citizenOrFamily: 'Vijay Singh', date: '2025-01-10', remarks: 'Educational purposes', status: 'Rejected', officialResponsible: 'Suresh Menon' },
];

const serviceTypes = ['Income Certificate', 'Land Record Update', 'Birth Certificate', 'Domicile Certificate', 'Caste Certificate', 'Death Certificate', 'Marriage Certificate'];

// Use officials from the Officials module
const officialsList = initialOfficials.map(o => o.name);

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    citizenOrFamily: '',
    date: new Date(),
    remarks: '',
    status: 'Pending' as Service['status'],
    officialResponsible: '',
  });

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.citizenOrFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.officialResponsible.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || service.serviceName === filterType;
    const matchesYear = filterYear === 'all' || service.date.startsWith(filterYear);
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;

    return matchesSearch && matchesType && matchesYear && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({
      serviceName: '',
      citizenOrFamily: '',
      date: new Date(),
      remarks: '',
      status: 'Pending',
      officialResponsible: '',
    });
    setIsAddDialogOpen(true);
  };

  const confirmAdd = () => {
    const newId = `SRV${String(services.length + 1).padStart(3, '0')}`;
    const newService: Service = {
      id: newId,
      serviceName: formData.serviceName,
      citizenOrFamily: formData.citizenOrFamily,
      date: format(formData.date, 'yyyy-MM-dd'),
      remarks: formData.remarks,
      status: formData.status,
      officialResponsible: formData.officialResponsible,
    };
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    toast.success('Service record added successfully');
  };

  const getStatusBadge = (status: Service['status']) => {
    const variants: Record<Service['status'], string> = {
      Pending: 'bg-warning/10 text-warning border-warning/20',
      Approved: 'bg-success/10 text-success border-success/20',
      Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      Completed: 'bg-accent/10 text-accent border-accent/20',
    };
    return <Badge className={`${variants[status]} border`}>{status}</Badge>;
  };

  const columns = [
    { header: 'Service ID', accessor: 'id' as keyof Service },
    { header: 'Service Name', accessor: 'serviceName' as keyof Service },
    { header: 'Citizen/Family', accessor: 'citizenOrFamily' as keyof Service },
    { header: 'Date', accessor: 'date' as keyof Service },
    { header: 'Official', accessor: 'officialResponsible' as keyof Service },
    { header: 'Remarks', accessor: 'remarks' as keyof Service },
    {
      header: 'Status',
      accessor: (row: Service) => getStatusBadge(row.status),
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Services Management"
              description="Track and manage service requests"
              onAdd={handleAdd}
              addButtonText="Log Service"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search services or officials..."
            />

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {(filterType !== 'all' || filterYear !== 'all' || filterStatus !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterType('all');
                    setFilterYear('all');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <DataTable data={filteredServices} columns={columns} emptyMessage="No services found" />
          </div>
        </main>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={formData.serviceName} onValueChange={(value) => setFormData({ ...formData, serviceName: value })}>
                <SelectTrigger id="service-type">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="citizen">Citizen/Family Name</Label>
              <Input
                id="citizen"
                value={formData.citizenOrFamily}
                onChange={(e) => setFormData({ ...formData, citizenOrFamily: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="official">Official Responsible</Label>
              <Select value={formData.officialResponsible} onValueChange={(value) => setFormData({ ...formData, officialResponsible: value })}>
                <SelectTrigger id="official">
                  <SelectValue placeholder="Select official" />
                </SelectTrigger>
                <SelectContent>
                  {officialsList.map((official) => (
                    <SelectItem key={official} value={official}>
                      {official}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.date} onSelect={(date) => date && setFormData({ ...formData, date })} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Enter remarks"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Service['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} className="bg-accent hover:bg-accent/90">
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
