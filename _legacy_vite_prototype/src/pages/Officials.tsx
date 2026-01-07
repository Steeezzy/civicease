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

export interface Official {
  id: string;
  name: string;
  designation: string;
  office: string;
  postingDate: string;
}

export const initialOfficials: Official[] = [
  { id: 'OFF001', name: 'Rajesh Gupta', designation: 'Tahsildar', office: 'North Zone', postingDate: '2023-05-15' },
  { id: 'OFF002', name: 'Suresh Menon', designation: 'Village Officer', office: 'West Zone', postingDate: '2024-01-10' },
  { id: 'OFF003', name: 'Anita Desai', designation: 'Revenue Inspector', office: 'South Zone', postingDate: '2022-11-20' },
];

export default function Officials() {
  const [officials, setOfficials] = useState<Official[]>(initialOfficials);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [formData, setFormData] = useState({ name: '', designation: '', office: '', postingDate: '' });

  const filteredOfficials = officials.filter(
    (official) =>
      official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      official.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      official.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: '', designation: '', office: '', postingDate: '' });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (official: Official) => {
    setSelectedOfficial(official);
    setFormData({
      name: official.name,
      designation: official.designation,
      office: official.office,
      postingDate: official.postingDate,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (official: Official) => {
    setSelectedOfficial(official);
    setIsDeleteDialogOpen(true);
  };

  const confirmAdd = () => {
    const newId = `OFF${String(officials.length + 1).padStart(3, '0')}`;
    const newOfficial: Official = {
      id: newId,
      name: formData.name,
      designation: formData.designation,
      office: formData.office,
      postingDate: formData.postingDate,
    };
    setOfficials([...officials, newOfficial]);
    setIsAddDialogOpen(false);
    toast.success('Official added successfully');
  };

  const confirmEdit = () => {
    if (!selectedOfficial) return;
    setOfficials(
      officials.map((o) =>
        o.id === selectedOfficial.id
          ? { ...o, ...formData }
          : o
      )
    );
    setIsEditDialogOpen(false);
    toast.success('Official updated successfully');
  };

  const confirmDelete = () => {
    if (!selectedOfficial) return;
    setOfficials(officials.filter((o) => o.id !== selectedOfficial.id));
    setIsDeleteDialogOpen(false);
    toast.success('Official deleted successfully');
  };

  const columns = [
    { header: 'Official ID', accessor: 'id' as keyof Official },
    { header: 'Name', accessor: 'name' as keyof Official },
    { header: 'Designation', accessor: 'designation' as keyof Official },
    { header: 'Office', accessor: 'office' as keyof Official },
    { header: 'Posting Date', accessor: 'postingDate' as keyof Official },
    {
      header: 'Actions',
      accessor: (row: Official) => (
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
              title="Official Management"
              description="Manage revenue officials and their postings"
              onAdd={handleAdd}
              addButtonText="Add Official"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by name, ID or designation..."
            />
            <DataTable data={filteredOfficials} columns={columns} emptyMessage="No officials found" />
          </div>
        </main>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Official</DialogTitle>
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
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Enter designation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="office">Office Location</Label>
              <Input
                id="office"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                placeholder="Enter office location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postingDate">Posting Date</Label>
              <Input
                id="postingDate"
                type="date"
                value={formData.postingDate}
                onChange={(e) => setFormData({ ...formData, postingDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} className="bg-accent hover:bg-accent/90">
              Add Official
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Official</DialogTitle>
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
              <Label htmlFor="edit-designation">Designation</Label>
              <Input
                id="edit-designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-office">Office Location</Label>
              <Input
                id="edit-office"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-postingDate">Posting Date</Label>
              <Input
                id="edit-postingDate"
                type="date"
                value={formData.postingDate}
                onChange={(e) => setFormData({ ...formData, postingDate: e.target.value })}
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
            <AlertDialogTitle>Delete Official</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOfficial?.name}? This action cannot be undone.
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
