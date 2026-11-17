import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Phone, ShieldCheck, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Nossos Médicos', path: '/doctors' },
    { name: 'Especialidades', path: '/specialties' },
    { name: 'Tratamentos', path: '/treatments' },
    { name: 'Convênios', path: '/insurance' },
    { name: 'Blog', path: '/blog' },
  ];

  return <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#061724] shadow-xl py-2' : 'bg-[#061724]/95 py-3'}`}><div className="container flex items-center justify-between"><Link to="/" className="z-10"><img src="/Logo_Incom_branca_(1).png" alt="Incom - Ortopedia e Medicina da Dor" className="h-11 sm:h-12 w-auto object-contain" /></Link><nav className="hidden lg:flex items-center gap-6"><div className="flex items-center gap-5">{navLinks.map((link) => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-[#8fdbc4]' : 'text-white/75 hover:text-white'}`}>{link.name}</Link>)}</div><Link to="/acesso" className="text-white/70 hover:text-white p-2" title="Área da equipe"><ShieldCheck size={18} /></Link><Link to="/appointment" className="btn bg-[#087b63] hover:bg-[#096b57] text-white flex items-center"><Phone size={16} className="mr-2" />Agendar consulta</Link></nav><button className="lg:hidden z-10 text-white" onClick={() => setIsMenuOpen((open) => !open)} aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button><div className={`fixed inset-0 bg-[#061724] z-10 transform transition-transform duration-300 lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}><div className="container h-full flex flex-col pt-28 pb-8"><nav className="flex flex-col gap-6">{navLinks.map((link) => <Link key={link.path} to={link.path} className={`text-lg font-medium ${location.pathname === link.path ? 'text-[#8fdbc4]' : 'text-white/80'}`} onClick={() => setIsMenuOpen(false)}>{link.name}</Link>)}<Link to="/acesso" className="text-lg font-medium text-white/80 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}><ShieldCheck size={19} /> Área da equipe</Link><Link to="/appointment" className="btn bg-[#087b63] text-white self-start mt-2 flex items-center" onClick={() => setIsMenuOpen(false)}><Phone size={16} className="mr-2" />Agendar consulta</Link></nav></div></div></div></header>;
};

export default Header;
