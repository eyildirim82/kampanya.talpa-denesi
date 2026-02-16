import React, { useState } from 'react';
import { Menu, X, Plane, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';

const PublicHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-talpa-navy text-white">
            <Plane className="h-6 w-6" />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-lg font-bold leading-none text-talpa-navy">TALPA</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-talpa-navy ${isActive('/') ? 'text-talpa-navy font-bold' : 'text-slate-600'}`}
          >
            Kampanyalar
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/admin/login">
            <Button variant="ghost" size="sm" leftIcon={<Lock className="h-4 w-4" />}>
              Yönetici
            </Button>
          </Link>
        </div>

        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
           <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-slate-700 hover:text-talpa-navy"
          >
            Kampanyalar
          </Link>
          <div className="pt-4 border-t border-slate-100">
             <Link to="/admin/login" onClick={() => setIsOpen(false)}>
              <Button fullWidth variant="secondary" leftIcon={<Lock className="h-4 w-4" />}>
                Yönetici Girişi
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;