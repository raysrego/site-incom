import React from 'react';
import { specialties } from '../data/specialties';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const SpecialtiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nossas Especialidades</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Oferecemos atendimento especializado em diversas áreas da ortopedia e medicina da dor, com profissionais qualificados em cada especialidade.
        </p>
        
        <div className="space-y-12 mb-12">
          {specialties.map((specialty) => (
            <div 
              key={specialty.id} 
              id={specialty.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-4">{specialty.name}</h2>
                <p className="text-gray-600 mb-6">
                  {specialty.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Disponibilidade</h3>
                    <div className="space-y-3">
                      {Object.entries(specialty.availability).map(([day, periods]) => (
                        <div key={day} className="flex">
                          <span className="font-medium text-primary-900 w-24">{day}:</span>
                          <span className="text-gray-600">{periods.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3">Horários</h3>
                    <div className="space-y-3">
                      {Object.entries(specialty.hours).map(([day, times]) => (
                        <div key={day} className="flex">
                          <span className="font-medium text-primary-900 w-24">{day}:</span>
                          <span className="text-gray-600">{times.join(' | ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Quando procurar esta especialidade?</h3>
                    <ul className="space-y-2">
                      {specialty.id === "ortopedia-geral" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dores nos ossos, articulações ou músculos</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Fraturas e traumas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Problemas posturais</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Limitações de movimento</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "coluna" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor lombar, cervical ou torácica</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Hérnia de disco</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Escoliose, cifose ou lordose</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor que irradia para braços ou pernas</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "joelho" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor no joelho</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Lesões ligamentares ou meniscais</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Artrose do joelho</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Instabilidade articular</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "quadril" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor no quadril</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Artrose do quadril</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Bursite trocantérica</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Necrose da cabeça femoral</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "ombro-cotovelo" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor no ombro ou cotovelo</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Lesão do manguito rotador</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Epicondilite (cotovelo de tenista)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Instabilidade do ombro</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "pe-tornozelo" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor no pé ou tornozelo</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Entorses</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Fascite plantar</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Joanetes e deformidades nos pés</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "mao" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor na mão, punho ou dedos</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Síndrome do túnel do carpo</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Tendinites</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Lesões traumáticas na mão</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "medicina-dor" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor crônica</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor neuropática</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Fibromialgia</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Dor relacionada ao câncer</span>
                          </li>
                        </>
                      )}
                      
                      {specialty.id === "ortopedia-pediatrica" && (
                        <>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Deformidades congênitas</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Pé torto congênito</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Displasia do desenvolvimento do quadril</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-secondary-600 mr-2">•</span>
                            <span>Escoliose infantil</span>
                          </li>
                        </>
                      )}
                    </ul>
                    
                    <div className="mt-6">
                      <Link 
                        to="/appointment" 
                        className="btn btn-primary w-full flex items-center justify-center"
                      >
                        <Calendar size={18} className="mr-2" />
                        Agendar Consulta
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialtiesPage;