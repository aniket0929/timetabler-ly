
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 bg-muted/50 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Timecrafter</h3>
            <p className="text-sm text-muted-foreground">
              Simplify your scheduling process with AI-powered timetable generation.
              Perfect for schools and colleges of all sizes.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Create Timetable
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Have questions or feedback? Reach out to our team for assistance.
            </p>
            <button className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Timecrafter. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
