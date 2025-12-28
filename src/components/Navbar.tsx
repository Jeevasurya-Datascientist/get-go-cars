import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Menu, X, ChevronRight, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  user?: { name: string; role: 'customer' | 'admin' } | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = user?.role === 'admin'
    ? [
      { path: '/admin', label: 'Dashboard' },
      { path: '/admin/cars', label: 'Fleet' },
      { path: '/admin/bookings', label: 'Bookings' },
      { path: '/admin/users', label: 'Users' },
    ]
    : [
      { path: '/', label: 'Home' },
      { path: '/cars', label: 'Browse Cars' },
      { path: '/bookings', label: 'My Bookings' },
      { path: '/contact', label: 'Contact' },
    ];

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm text-foreground"
          : isHome
            ? "bg-transparent border-transparent pt-4 text-white"
            : "bg-transparent border-transparent pt-4 text-foreground"
      )}
    >
      <div className={cn("container flex items-center justify-between transition-all", scrolled ? "h-16" : "h-20")}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
            <span className="font-extrabold text-xl">D</span>
          </div>
          <span className={cn("font-bold text-xl tracking-tight transition-colors", isTransparent ? "text-white" : "text-foreground")}>DriveYoo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={cn(
          "hidden md:flex items-center gap-1 px-2 py-1 rounded-full border shadow-sm transition-all",
          isTransparent
            ? "bg-white/10 backdrop-blur-md border-white/10"
            : "bg-background/50 backdrop-blur-sm border-border/50"
        )}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                isActive(link.path)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : isTransparent
                    ? "text-gray-200 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className={cn("flex items-center gap-3 pl-4 border-l transition-colors", isTransparent ? "border-white/20" : "border-border/50")}>
              <Link to='/profile'>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="text-right hidden lg:block">
                    <p className={cn("text-sm font-medium leading-none transition-colors", isTransparent ? "text-white group-hover:text-gray-200" : "text-foreground group-hover:text-primary")}>{user.name}</p>
                    <p className={cn("text-xs uppercase tracking-wider scale-90 origin-right", isTransparent ? "text-gray-300" : "text-muted-foreground")}>{user.role}</p>
                  </div>
                  <Avatar className={cn("h-9 w-9 border-2 shadow-sm transition-colors", isTransparent ? "border-white/20 group-hover:border-white" : "border-background group-hover:border-primary")}>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={onLogout} title="Logout" className={cn("rounded-full transition-colors", isTransparent ? "text-white hover:bg-white/20 hover:text-white" : "hover:bg-destructive/10 hover:text-destructive")}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth" className={cn("text-sm font-medium transition-colors hover:opacity-80", isTransparent ? "text-white" : "text-foreground hover:text-primary")}>
                Login
              </Link>
              <Button className="rounded-full px-6 shadow-gold hover:shadow-gold/50 transition-shadow" asChild>
                <Link to="/auth?mode=register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn("md:hidden p-2 rounded-lg transition-colors", isTransparent ? "text-white hover:bg-white/20" : "hover:bg-muted text-foreground")}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-xl animate-in slide-in-from-top-2">

          {user && (
            <div className="p-4 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{user.role}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Profile
                </Link>
              </Button>
            </div>
          )}

          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-colors",
                  isActive(link.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-border/50 bg-muted/30">
            {user ? (
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/auth?mode=register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
