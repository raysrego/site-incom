import React from 'react';
import { blogPosts } from '../data/blog';
import { Calendar, User, Tag } from 'lucide-react';

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Blog Incom</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Fique por dentro das novidades, dicas e informações sobre ortopedia e saúde.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {blogPosts.map((post) => (
              <div key={post.id} id={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 sm:h-80 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      {post.author}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                  
                  <div 
                    className="text-gray-600 mb-6 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    {post.tags.map((tag, index) => (
                      <div key={index} className="flex items-center text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Categorias</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Ortopedia
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Coluna
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Medicina da Dor
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Lesões Esportivas
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Tratamentos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary-700 flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Saúde e Bem-estar
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Posts Populares</h3>
              <div className="space-y-4">
                <a href="#prevencao-lesoes-esportivas" className="flex items-start group">
                  <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                    <img 
                      src="https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Prevenção de lesões" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-sm group-hover:text-primary-700 transition-colors">
                      Prevenção de lesões esportivas: dicas importantes
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">15/06/2025</p>
                  </div>
                </a>
                
                <a href="#dor-nas-costas" className="flex items-start group">
                  <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                    <img 
                      src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Dor nas costas" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-sm group-hover:text-primary-700 transition-colors">
                      Dor nas costas: quando procurar um especialista
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">02/05/2025</p>
                  </div>
                </a>
                
                <a href="#cuidados-pos-operatorios" className="flex items-start group">
                  <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                    <img 
                      src="https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Cuidados pós-operatórios" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-sm group-hover:text-primary-700 transition-colors">
                      Cuidados pós-operatórios em cirurgias ortopédicas
                    </h4>
                    <p className="text-gray-500 text-xs mt-1">10/04/2025</p>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-600 text-sm mb-4">
                Cadastre-se para receber novidades, dicas e informações sobre saúde ortopédica.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="input-field"
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                >
                  Inscrever-se
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;