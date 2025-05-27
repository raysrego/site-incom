import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and About */}
          <div className="space-y-4">
            <Logo className="h-12" />
            <p className="mt-4 text-gray-300">
              Excelência em ortopedia e medicina da dor, com atendimento humanizado e as mais avançadas tecnologias para o seu bem-estar.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://instagram.com" className="text-white hover:text-secondary-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-white hover:text-secondary-400 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com" className="text-white hover:text-secondary-400 transition-colors duration-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/doctors" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  Nossos Médicos
                </Link>
              </li>
              <li>
                <Link to="/specialties" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  Especialidades
                </Link>
              </li>
              <li>
                <Link to="/treatments" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  Tratamentos
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  Convênios
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  Agendar Consulta
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1 text-secondary-500" />
                <span className="text-gray-300">Av. Principal, 1234, Centro, São Luís - MA, 65000-000</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-secondary-500" />
                <span className="text-gray-300">(98) 3232-0000</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-secondary-500" />
                <a href="mailto:contato@incom-slz.com.br" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200">
                  contato@incom-slz.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Horário de Funcionamento</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Clock size={18} className="mr-3 mt-1 text-secondary-500" />
                <div>
                  <p className="text-gray-300">Segunda à Sexta</p>
                  <p className="text-gray-300">8h00 às 18h00</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock size={18} className="mr-3 mt-1 text-secondary-500" />
                <div>
                  <p className="text-gray-300">Sábado</p>
                  <p className="text-gray-300">8h00 às 12h00</p>
                </div>
              </li>
              <li className="text-gray-300 mt-4">
                <strong className="text-secondary-500">Emergências:</strong> Disponível 24 horas para pacientes através do contato telefônico.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Incom - Ortopedia e Medicina da Dor. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;