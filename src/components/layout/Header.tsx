import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo';
import { Menu, X, Phone } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Nossos Médicos', path: '/doctors' },
    { name: 'Especialidades', path: '/specialties' },
    { name: 'Tratamentos', path: '/treatments' },
    { name: 'Convênios', path: '/insurance' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="z-10">
          <Logo className="h-12" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? 'text-secondary-600'
                  : isScrolled
                  ? 'text-primary-900 hover:text-secondary-600'
                  : 'text-primary-800 hover:text-secondary-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/appointment" 
            className="btn btn-primary flex items-center"
          >
            <Phone size={16} className="mr-2" />
            Agendar Consulta
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-10 text-primary-900"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-10 transform transition-transform duration-300 md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="container h-full flex flex-col pt-24 pb-8">
            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium ${
                    location.pathname === link.path
                      ? 'text-secondary-600'
                      : 'text-primary-900 hover:text-secondary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/appointment"
                className="btn btn-primary self-start mt-4 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone size={16} className="mr-2" />
                Agendar Consulta
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;