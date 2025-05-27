import React from 'react';
import { doctors } from '../data/doctors';
import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nossa Equipe Médica</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Conheça os especialistas que fazem parte da nossa equipe, profissionais qualificados e dedicados à sua saúde.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {doctors.map((doctor) => (
            <div key={doctor.id} id={doctor.id} className="card overflow-hidden group">
              <div className="h-64 overflow-hidden">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                <p className="text-secondary-600 mb-4">{doctor.specialty}</p>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {doctor.biography}
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Formação</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {doctor.education.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-secondary-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <Link 
                    to="/appointment" 
                    className="btn btn-sm btn-primary py-2 px-4 text-sm flex items-center"
                  >
                    <Phone size={14} className="mr-1" />
                    Agendar
                  </Link>
                  <a 
                    href="mailto:contato@incom-slz.com.br" 
                    className="text-primary-700 hover:text-secondary-600 flex items-center text-sm"
                  >
                    <Mail size={14} className="mr-1" />
                    Contato
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Sobre Nossa Equipe</h2>
          <p className="text-gray-600 mb-4">
            A Incom orgulha-se de contar com uma equipe médica altamente qualificada e especializada em diversas áreas da ortopedia e medicina da dor. Nossos profissionais possuem ampla formação acadêmica e experiência clínica, proporcionando aos pacientes um atendimento de excelência.
          </p>
          <p className="text-gray-600 mb-4">
            Todos os nossos médicos são membros de sociedades médicas reconhecidas nacionalmente e participam regularmente de congressos e cursos de atualização, garantindo o acesso às técnicas mais modernas e eficazes de diagnóstico e tratamento.
          </p>
          <p className="text-gray-600">
            Na Incom, acreditamos que o cuidado humanizado, aliado ao conhecimento técnico-científico, é essencial para oferecer o melhor tratamento aos nossos pacientes. Nossa equipe está sempre disponível para esclarecer dúvidas e proporcionar um atendimento personalizado, considerando as necessidades individuais de cada pessoa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;