
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="w-full py-4 px-6 bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Timecrafter
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant={location.pathname === '/' ? 'default' : 'ghost'}>
              Home
            </Button>
          </Link>
          <Link to="/generator">
            <Button variant={location.pathname === '/generator' ? 'default' : 'ghost'}>
              Create Timetable
            </Button>
          </Link>
          {location.pathname === '/timetable' && (
            <Link to="/timetable">
              <Button variant="default">
                View Timetable
              </Button>
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
