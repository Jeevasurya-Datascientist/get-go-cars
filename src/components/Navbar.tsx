import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user?.role === 'admin' 
    ? [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/cars', label: 'Cars' },
        { path: '/admin/bookings', label: 'Bookings' },
        { path: '/admin/users', label: 'Users' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/cars', label: 'Browse Cars' },
        { path: '/bookings', label: 'My Bookings' },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">DriveElite</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(link.path)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === 'admin' ? '/admin/profile' : '/profile'}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/auth?mode=register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.path)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onLogout} className="w-full justify-start px-4">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link to="/auth?mode=register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
