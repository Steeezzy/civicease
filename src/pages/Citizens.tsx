import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Citizen {
  id: string;
  name: string;
  age: number;
  address: string;
  contact: string;
}

const initialCitizens: Citizen[] = [
  { id: 'CTZ001', name: 'Ramesh Kumar', age: 45, address: '123 MG Road, Delhi', contact: '+91 9876543210' },
  { id: 'CTZ002', name: 'Priya Sharma', age: 32, address: '456 Park Street, Mumbai', contact: '+91 9876543211' },
  { id: 'CTZ003', name: 'Amit Patel', age: 28, address: '789 Church Street, Bangalore', contact: '+91 9876543212' },
  { id: 'CTZ004', name: 'Sneha Reddy', age: 38, address: '321 Brigade Road, Hyderabad', contact: '+91 9876543213' },
  { id: 'CTZ005', name: 'Vijay Singh', age: 52, address: '654 Marine Drive, Chennai', contact: '+91 9876543214' },
];

export default function Citizens() {
  const [citizens, setCitizens] = useState<Citizen[]>(initialCitizens);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [formData, setFormData] = useState({ name: '', age: '', address: '', contact: '' });

  const filteredCitizens = citizens.filter(
    (citizen) =>
      citizen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citizen.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: '', age: '', address: '', contact: '' });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setFormData({
      name: citizen.name,
      age: citizen.age.toString(),
      address: citizen.address,
      contact: citizen.contact,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsDeleteDialogOpen(true);
  };

  const confirmAdd = () => {
    const newId = `CTZ${String(citizens.length + 1).padStart(3, '0')}`;
    const newCitizen: Citizen = {
      id: newId,
      name: formData.name,
      age: parseInt(formData.age),
      address: formData.address,
      contact: formData.contact,
    };
    setCitizens([...citizens, newCitizen]);
    setIsAddDialogOpen(false);
    toast.success('Citizen added successfully');
  };

  const confirmEdit = () => {
    if (!selectedCitizen) return;
    setCitizens(
      citizens.map((c) =>
        c.id === selectedCitizen.id
          ? { ...c, name: formData.name, age: parseInt(formData.age), address: formData.address, contact: formData.contact }
          : c
      )
    );
    setIsEditDialogOpen(false);
    toast.success('Citizen updated successfully');
  };

  const confirmDelete = () => {
    if (!selectedCitizen) return;
    setCitizens(citizens.filter((c) => c.id !== selectedCitizen.id));
    setIsDeleteDialogOpen(false);
    toast.success('Citizen deleted successfully');
  };

  const columns = [
    { header: 'Citizen ID', accessor: 'id' as keyof Citizen },
    { header: 'Name', accessor: 'name' as keyof Citizen },
    { header: 'Age', accessor: 'age' as keyof Citizen },
    { header: 'Address', accessor: 'address' as keyof Citizen },
    { header: 'Contact', accessor: 'contact' as keyof Citizen },
    {
      header: 'Actions',
      accessor: (row: Citizen) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(row)}
            className="hover:bg-accent/10 hover:text-accent"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDelete(row)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
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
              title="Citizen Management"
              description="Manage citizen records and information"
              onAdd={handleAdd}
              addButtonText="Add Citizen"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by name or ID..."
            />
            <DataTable data={filteredCitizens} columns={columns} emptyMessage="No citizens found" />
          </div>
        </main>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Citizen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} className="bg-accent hover:bg-accent/90">
              Add Citizen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Citizen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Number</Label>
              <Input
                id="edit-contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit} className="bg-accent hover:bg-accent/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Citizen</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCitizen?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
