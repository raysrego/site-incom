import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Stethoscope, Award, Clock, Check } from 'lucide-react';
import { doctors } from '../data/doctors';
import { specialties } from '../data/specialties';
import { treatments } from '../data/treatments';
import { insuranceList } from '../data/insurance';
import { blogPosts } from '../data/blog';

const HomePage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Excelência em Ortopedia e Medicina da Dor</h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Tratamentos especializados e tecnologia avançada para sua saúde e bem-estar.
              Equipe médica altamente qualificada para cuidar de você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/appointment" className="btn bg-secondary-600 hover:bg-secondary-700 text-white flex items-center justify-center">
                <Calendar size={18} className="mr-2" />
                Agendar Consulta
              </Link>
              <Link to="/specialties" className="btn bg-white hover:bg-gray-100 text-primary-900 flex items-center justify-center">
                <Stethoscope size={18} className="mr-2" />
                Nossas Especialidades
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20 z-0 bg-pattern"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <Award size={32} className="text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Equipe Especializada</h3>
              <p className="text-gray-600">
                Médicos especialistas em diversas áreas da ortopedia para oferecer o melhor tratamento.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <Clock size={32} className="text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-600">
                Dedicação e atenção aos pacientes, com foco no bem-estar e na qualidade de vida.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <Check size={32} className="text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tecnologia Avançada</h3>
              <p className="text-gray-600">
                Equipamentos modernos para diagnósticos precisos e tratamentos eficazes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="section-title text-center mx-auto">Nossas Especialidades</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Oferecemos tratamento especializado para diversas condições ortopédicas, com profissionais qualificados em cada área.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.slice(0, 6).map((specialty) => (
              <div key={specialty.id} className="card hover:border-secondary-500 hover:border group">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-secondary-600 transition-colors">
                    {specialty.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {specialty.description}
                  </p>
                  <Link 
                    to={`/specialties#${specialty.id}`} 
                    className="text-primary-700 font-medium hover:text-secondary-600 flex items-center"
                  >
                    Ver detalhes
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/specialties" className="btn btn-outline">
              Ver todas as especialidades
            </Link>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center mx-auto">Nossa Equipe Médica</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Conheça os especialistas que fazem parte da nossa equipe, profissionais qualificados e dedicados à sua saúde.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="card overflow-hidden group">
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
                  <Link 
                    to={`/doctors#${doctor.id}`} 
                    className="text-primary-700 font-medium hover:text-secondary-600 flex items-center"
                  >
                    Ver perfil
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/doctors" className="btn btn-outline">
              Conhecer todos os médicos
            </Link>
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="section-title text-center mx-auto">Nossos Tratamentos</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Conheça os principais tratamentos oferecidos em nossa clínica para diversas condições ortopédicas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {treatments.slice(0, 4).map((treatment) => (
              <div key={treatment.id} className="card flex flex-col md:flex-row overflow-hidden group">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={treatment.image} 
                    alt={treatment.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-semibold mb-2">{treatment.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {treatment.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {treatment.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <Link 
                    to={`/treatments#${treatment.id}`} 
                    className="text-primary-700 font-medium hover:text-secondary-600 flex items-center mt-auto"
                  >
                    Saiba mais
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/treatments" className="btn btn-outline">
              Ver todos os tratamentos
            </Link>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center mx-auto">Convênios Aceitos</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Trabalhamos com diversos convênios para facilitar seu acesso aos nossos serviços.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {insuranceList.map((insurance) => (
              <div key={insurance.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center h-24 transition-transform hover:-translate-y-1 duration-300">
                <span className="font-medium text-gray-800">{insurance.name}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/insurance" className="btn btn-outline">
              Mais informações sobre convênios
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="section-title text-center mx-auto">Blog Incom</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Fique por dentro das novidades, dicas e informações sobre ortopedia e saúde.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="card overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-secondary-600">{post.author}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-secondary-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog#${post.id}`} 
                    className="text-primary-700 font-medium hover:text-secondary-600 flex items-center"
                  >
                    Ler mais
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/blog" className="btn btn-outline">
              Ver todos os artigos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Agende sua consulta hoje mesmo</h2>
          <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-3xl mx-auto">
            Nossa equipe está pronta para oferecer o melhor atendimento e tratamento para suas necessidades ortopédicas.
          </p>
          <Link to="/appointment" className="btn bg-secondary-600 hover:bg-secondary-700 text-white inline-flex items-center">
            <Calendar size={18} className="mr-2" />
            Agendar Consulta
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;