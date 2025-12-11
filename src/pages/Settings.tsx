import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Briefcase, LogOut } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Settings() {
  const { officerName, logout } = useAuth();
  const authData = JSON.parse(localStorage.getItem('civicease_auth') || '{}');

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your profile and preferences</p>
            </div>

            {/* Officer Profile Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Officer Profile</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    <User className="inline h-4 w-4 mr-2" />
                    Name
                  </Label>
                  <Input id="name" value={officerName} disabled className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email
                  </Label>
                  <Input id="email" value={authData.email || ''} disabled className="bg-muted" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="designation">
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Designation
                  </Label>
                  <Input id="designation" value="Revenue Officer" disabled className="bg-muted" />
                </div>
              </div>
            </Card>

            {/* Appearance Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <DarkModeToggle />
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout? You will need to login again to access the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
