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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockBookings, mockCars, mockUsers } from '@/data/mockData';
import {
  Car, Search, MoreVertical, CheckCircle, XCircle, 
  LogOut, LayoutDashboard, CarFront, ClipboardList, 
  UserCog, BarChart3, Menu, Eye, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface AdminBookingsPageProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function AdminBookingsPage({ user, onLogout }: AdminBookingsPageProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: CarFront, label: 'Cars', path: '/admin/cars' },
    { icon: ClipboardList, label: 'Bookings', path: '/admin/bookings' },
    { icon: UserCog, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const filteredBookings = mockBookings.filter((booking) => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    return true;
  });

  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    confirmed: 'bg-success/10 text-success border-success/20',
    active: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-muted text-muted-foreground border-muted',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const handleApprove = (bookingId: string) => {
    toast({
      title: "Booking approved",
      description: `Booking ${bookingId} has been confirmed.`,
    });
  };

  const handleReject = (bookingId: string) => {
    toast({
      title: "Booking rejected",
      description: `Booking ${bookingId} has been cancelled.`,
      variant: "destructive",
    });
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
            <h1 className="text-xl font-semibold">Booking Management</h1>
            <p className="text-sm text-muted-foreground">{mockBookings.length} total bookings</p>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <CardTitle>All Bookings</CardTitle>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const car = mockCars.find((c) => c.id === booking.carId);
                    const customer = mockUsers.find((u) => u.id === booking.userId);

                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">
                          #{booking.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded bg-muted overflow-hidden">
                              <img
                                src={car?.images[0]}
                                alt={car?.model}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm">{car?.brand} {car?.model}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{customer?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{customer?.email}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{format(new Date(booking.startDate), 'PP')}</p>
                          <p className="text-xs text-muted-foreground">
                            to {format(new Date(booking.endDate), 'PP')}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("capitalize", statusColors[booking.status])}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">${booking.totalPrice}</TableCell>
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
                                View Details
                              </DropdownMenuItem>
                              {booking.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApprove(booking.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleReject(booking.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
