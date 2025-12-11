import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuth: (user: { name: string; email: string; role: 'customer' | 'admin' }) => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('mode') === 'register' ? 'register' : 'login';
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in real app, this would call Supabase auth
    setTimeout(() => {
      // Demo: admin@carrental.com logs in as admin, others as customer
      const isAdmin = loginForm.email === 'admin@carrental.com';
      onAuth({
        name: isAdmin ? 'Admin User' : 'John Doe',
        email: loginForm.email,
        role: isAdmin ? 'admin' : 'customer',
      });
      toast({
        title: "Welcome back!",
        description: `You're now logged in as ${isAdmin ? 'admin' : 'customer'}.`,
      });
      navigate(isAdmin ? '/admin' : '/');
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      onAuth({
        name: registerForm.name,
        email: registerForm.email,
        role: 'customer',
      });
      toast({
        title: "Account created!",
        description: "Welcome to DriveElite.",
      });
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl text-secondary mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Car className="h-6 w-6 text-secondary-foreground" />
            </div>
            DriveElite
          </div>
          <p className="text-primary-foreground/70">Premium Car Rental Service</p>
        </div>

        <Card className="border-border/20 shadow-xl">
          <Tabs defaultValue={defaultTab}>
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" variant="secondary" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Demo: Use <code className="bg-muted px-1 rounded">admin@carrental.com</code> for admin access
                  </p>
                </CardContent>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" variant="secondary" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
