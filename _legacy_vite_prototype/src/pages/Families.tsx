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
import { Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Family {
  id: string;
  headOfFamily: string;
  membersCount: number;
  address: string;
  annualIncome: number;
}

const initialFamilies: Family[] = [
  { id: 'FAM001', headOfFamily: 'Ramesh Kumar', membersCount: 4, address: '123 MG Road, Delhi', annualIncome: 450000 },
  { id: 'FAM002', headOfFamily: 'Priya Sharma', membersCount: 3, address: '456 Park Street, Mumbai', annualIncome: 600000 },
  { id: 'FAM003', headOfFamily: 'Amit Patel', membersCount: 5, address: '789 Church Street, Bangalore', annualIncome: 350000 },
  { id: 'FAM004', headOfFamily: 'Sneha Reddy', membersCount: 2, address: '321 Brigade Road, Hyderabad', annualIncome: 800000 },
  { id: 'FAM005', headOfFamily: 'Vijay Singh', membersCount: 6, address: '654 Marine Drive, Chennai', annualIncome: 250000 },
];

export default function Families() {
  const [families, setFamilies] = useState<Family[]>(initialFamilies);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTreeDialogOpen, setIsTreeDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [formData, setFormData] = useState({ headOfFamily: '', membersCount: '', address: '', annualIncome: '' });

  const filteredFamilies = families.filter(
    (family) =>
      family.headOfFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      family.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ headOfFamily: '', membersCount: '', address: '', annualIncome: '' });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (family: Family) => {
    setSelectedFamily(family);
    setFormData({
      headOfFamily: family.headOfFamily,
      membersCount: family.membersCount.toString(),
      address: family.address,
      annualIncome: family.annualIncome.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (family: Family) => {
    setSelectedFamily(family);
    setIsDeleteDialogOpen(true);
  };

  const handleViewTree = (family: Family) => {
    setSelectedFamily(family);
    setIsTreeDialogOpen(true);
  };

  const confirmAdd = () => {
    const newId = `FAM${String(families.length + 1).padStart(3, '0')}`;
    const newFamily: Family = {
      id: newId,
      headOfFamily: formData.headOfFamily,
      membersCount: parseInt(formData.membersCount),
      address: formData.address,
      annualIncome: parseInt(formData.annualIncome) || 0,
    };
    setFamilies([...families, newFamily]);
    setIsAddDialogOpen(false);
    toast.success('Family added successfully');
  };

  const confirmEdit = () => {
    if (!selectedFamily) return;
    setFamilies(
      families.map((f) =>
        f.id === selectedFamily.id
          ? {
            ...f,
            headOfFamily: formData.headOfFamily,
            membersCount: parseInt(formData.membersCount),
            address: formData.address,
            annualIncome: parseInt(formData.annualIncome) || 0,
          }
          : f
      )
    );
    setIsEditDialogOpen(false);
    toast.success('Family updated successfully');
  };

  const confirmDelete = () => {
    if (!selectedFamily) return;
    setFamilies(families.filter((f) => f.id !== selectedFamily.id));
    setIsDeleteDialogOpen(false);
    toast.success('Family deleted successfully');
  };

  const columns = [
    { header: 'Family ID', accessor: 'id' as keyof Family },
    { header: 'Head of Family', accessor: 'headOfFamily' as keyof Family },
    { header: 'Members Count', accessor: 'membersCount' as keyof Family },
    {
      header: 'Annual Income',
      accessor: (row: Family) => `₹${row.annualIncome.toLocaleString()}`,
    },
    { header: 'Address', accessor: 'address' as keyof Family },
    {
      header: 'Actions',
      accessor: (row: Family) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleViewTree(row)}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Eye className="h-4 w-4" />
          </Button>
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
              title="Family Management"
              description="Manage family records and relationships"
              onAdd={handleAdd}
              addButtonText="Add Family"
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by head of family or ID..."
            />
            <DataTable data={filteredFamilies} columns={columns} emptyMessage="No families found" />
          </div>
        </main>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Family</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="head">Head of Family</Label>
              <Input
                id="head"
                value={formData.headOfFamily}
                onChange={(e) => setFormData({ ...formData, headOfFamily: e.target.value })}
                placeholder="Enter head of family name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Members Count</Label>
              <Input
                id="count"
                type="number"
                value={formData.membersCount}
                onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
                placeholder="Enter number of members"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income (₹)</Label>
              <Input
                id="income"
                type="number"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                placeholder="Enter annual family income"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter family address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} className="bg-accent hover:bg-accent/90">
              Add Family
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Family</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-head">Head of Family</Label>
              <Input
                id="edit-head"
                value={formData.headOfFamily}
                onChange={(e) => setFormData({ ...formData, headOfFamily: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-count">Members Count</Label>
              <Input
                id="edit-count"
                type="number"
                value={formData.membersCount}
                onChange={(e) => setFormData({ ...formData, membersCount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-income">Annual Income (₹)</Label>
              <Input
                id="edit-income"
                type="number"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
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

      {/* Family Tree Dialog */}
      <Dialog open={isTreeDialogOpen} onOpenChange={setIsTreeDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Family Tree - {selectedFamily?.headOfFamily}</DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="bg-muted rounded-lg p-8 text-center">
              <div className="mb-8">
                <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold">
                  {selectedFamily?.headOfFamily}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Annual Income: ₹{selectedFamily?.annualIncome.toLocaleString()}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {Array.from({ length: (selectedFamily?.membersCount || 1) - 1 }).map((_, i) => (
                  <div key={i} className="bg-accent/20 border-2 border-accent rounded-lg px-4 py-3 text-sm">
                    Member {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-6">
                Family tree visualization placeholder
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsTreeDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Family</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the family of {selectedFamily?.headOfFamily}? This action cannot be undone.
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
