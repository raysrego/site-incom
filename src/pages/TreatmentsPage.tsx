import React from 'react';
import { treatments } from '../data/treatments';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const TreatmentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nossos Tratamentos</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Conheça os principais tratamentos oferecidos em nossa clínica para diversas condições ortopédicas.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {treatments.map((treatment) => (
            <div 
              key={treatment.id} 
              id={treatment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg"
            >
              <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                <img 
                  src={treatment.image} 
                  alt={treatment.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6">
                <h2 className="text-2xl font-semibold mb-3">{treatment.name}</h2>
                <p className="text-gray-600 mb-4">
                  {treatment.description}
                </p>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-sm mb-2">Especialidades relacionadas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {treatment.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link 
                  to="/appointment" 
                  className="btn btn-primary mt-2 inline-flex items-center"
                >
                  <Calendar size={16} className="mr-2" />
                  Agendar Consulta
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Abordagem Terapêutica</h2>
          <p className="text-gray-600 mb-4">
            Na Incom, acreditamos em uma abordagem individualizada e multidisciplinar para o tratamento de condições ortopédicas. Nosso objetivo é não apenas tratar os sintomas, mas identificar e abordar as causas subjacentes dos problemas, proporcionando resultados duradouros e melhorando a qualidade de vida dos nossos pacientes.
          </p>
          <p className="text-gray-600 mb-4">
            Sempre que possível, priorizamos tratamentos conservadores e minimamente invasivos, reservando procedimentos cirúrgicos para casos em que são realmente necessários. Nossa equipe médica está sempre atualizada com as técnicas mais modernas e eficazes disponíveis.
          </p>
          <p className="text-gray-600 mb-4">
            Além dos tratamentos listados, oferecemos programas de reabilitação personalizados, com acompanhamento contínuo para garantir a recuperação adequada e prevenir recorrências.
          </p>
          <p className="text-gray-600">
            Cada plano de tratamento é cuidadosamente elaborado considerando as necessidades específicas, histórico médico, estilo de vida e objetivos do paciente, sempre com foco na segurança e eficácia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreatmentsPage;