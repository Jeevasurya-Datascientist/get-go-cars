import { Car } from '@/types';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className="border-t border-border/50 bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <span className="text-secondary-foreground font-bold">D</span>
              </div>
              <span>DriveElite</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Premium car rental service offering luxury and comfort for every journey.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/cars" className="hover:text-secondary transition-colors">Browse Cars</Link></li>
              <li><Link to="/auth" className="hover:text-secondary transition-colors">Login / Register</Link></li>
              <li><Link to="/bookings" className="hover:text-secondary transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-secondary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} DriveElite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
