import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { mockCars } from '@/data/mockData';
import {
  Car, Plus, Search, MoreVertical, Edit, Trash2, 
  LogOut, LayoutDashboard, CarFront, ClipboardList, 
  UserCog, BarChart3, Menu, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AdminCarsPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function AdminCarsPage({ user, onLogout }: AdminCarsPageProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<typeof mockCars[0] | null>(null);

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: CarFront, label: 'Cars', path: '/admin/cars' },
    { icon: ClipboardList, label: 'Bookings', path: '/admin/bookings' },
    { icon: UserCog, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const filteredCars = mockCars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    toast({
      title: "Car deleted",
      description: `${selectedCar?.brand} ${selectedCar?.model} has been removed.`,
    });
    setDeleteDialogOpen(false);
    setSelectedCar(null);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-primary text-primary-foreground transition-all duration-300 lg:relative",
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-primary-foreground/10">
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <Car className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span>DriveElite</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive(link.path)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 bg-background border-b border-border">
          <div>
            <h1 className="text-xl font-semibold">Car Management</h1>
            <p className="text-sm text-muted-foreground">{mockCars.length} total cars</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/admin/cars/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Link>
          </Button>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <CardTitle>Fleet Inventory</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cars..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded bg-muted overflow-hidden">
                            <img
                              src={car.images[0]}
                              alt={car.model}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{car.brand}</p>
                            <p className="text-sm text-muted-foreground">{car.model} ({car.year})</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{car.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            car.status === 'available' && "bg-success/10 text-success border-success/20",
                            car.status === 'rented' && "bg-warning/10 text-warning border-warning/20",
                            car.status === 'maintenance' && "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {car.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${car.pricePerDay}</TableCell>
                      <TableCell>{car.rating}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setSelectedCar(car);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCar?.brand} {selectedCar?.model}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
