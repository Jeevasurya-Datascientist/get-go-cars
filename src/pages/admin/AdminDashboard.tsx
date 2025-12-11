import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { mockCars, mockBookings, mockUsers } from '@/data/mockData';
import {
  Car, Users, Calendar, DollarSign, TrendingUp, 
  MoreVertical, Plus, LogOut, LayoutDashboard, 
  CarFront, ClipboardList, UserCog, BarChart3, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AdminDashboardProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$24,560', 
      change: '+12.5%', 
      icon: DollarSign,
      color: 'bg-success/10 text-success'
    },
    { 
      title: 'Active Bookings', 
      value: '23', 
      change: '+4.3%', 
      icon: Calendar,
      color: 'bg-primary/10 text-primary'
    },
    { 
      title: 'Available Cars', 
      value: mockCars.filter(c => c.status === 'available').length.toString(), 
      change: '-2.1%', 
      icon: Car,
      color: 'bg-secondary/10 text-secondary'
    },
    { 
      title: 'Total Customers', 
      value: '1,247', 
      change: '+8.2%', 
      icon: Users,
      color: 'bg-warning/10 text-warning'
    },
  ];

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: CarFront, label: 'Cars', path: '/admin/cars' },
    { icon: ClipboardList, label: 'Bookings', path: '/admin/bookings' },
    { icon: UserCog, label: 'Users', path: '/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const recentBookings = mockBookings.slice(0, 5);

  const statusColors = {
    pending: 'bg-warning/10 text-warning',
    confirmed: 'bg-success/10 text-success',
    active: 'bg-primary/10 text-primary',
    completed: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive/10 text-destructive',
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
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/admin/cars/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Link>
          </Button>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        stat.change.startsWith('+') ? "text-success" : "text-destructive"
                      )}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={cn("p-3 rounded-lg", stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/bookings">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => {
                      const car = mockCars.find(c => c.id === booking.carId);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{car?.brand} {car?.model}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(booking.startDate), 'PP')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={statusColors[booking.status]}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${booking.totalPrice}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Fleet Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Fleet Overview</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/cars">Manage</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price/Day</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCars.slice(0, 5).map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted overflow-hidden">
                              <img
                                src={car.images[0]}
                                alt={car.model}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{car.brand}</p>
                              <p className="text-xs text-muted-foreground">{car.model}</p>
                            </div>
                          </div>
                        </TableCell>
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
                        <TableCell className="text-right">${car.pricePerDay}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
        </div>
      </main>
    </div>
  );
}
