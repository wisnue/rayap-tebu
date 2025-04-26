import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#1E40AF] shadow-md py-2'
          : 'bg-[#1E40AF] py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/logo.svg" 
            alt="Rayap Tebu" 
            className="h-10 w-auto mr-2 bg-white p-1 rounded-full" 
          />
          <h1 className="text-xl font-bold text-white">
            Rayap Tebu
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" label="Dashboard" />
          <NavLink to="/form" label="Input Data" />
          <NavLink to="/data" label="Tabel Data" />
          <NavLink to="/analysis" label="Analisis" />
          <NavLink to="/settings" label="Pengaturan" />
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1E40AF] shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3 py-3">
              <MobileNavLink to="/" label="Dashboard" onClick={toggleMenu} />
              <MobileNavLink to="/form" label="Input Data" onClick={toggleMenu} />
              <MobileNavLink to="/data" label="Tabel Data" onClick={toggleMenu} />
              <MobileNavLink to="/analysis" label="Analisis" onClick={toggleMenu} />
              <MobileNavLink to="/settings" label="Pengaturan" onClick={toggleMenu} />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink = ({ to, label }: NavLinkProps) => (
  <Link
    to={to}
    className="text-white hover:text-yellow-200 font-medium transition-colors"
  >
    {label}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, label, onClick }: MobileNavLinkProps) => (
  <Link
    to={to}
    className="text-white hover:text-yellow-200 font-medium transition-colors block py-2"
    onClick={onClick}
  >
    {label}
  </Link>
);

export default Header;
