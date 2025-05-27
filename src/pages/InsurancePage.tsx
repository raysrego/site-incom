import React from 'react';
import { insuranceList } from '../data/insurance';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';

const InsurancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Convênios</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          A Incom trabalha com os principais convênios do mercado para facilitar seu acesso aos nossos serviços.
        </p>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-6">Convênios Aceitos</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {insuranceList.map((insurance) => (
              <div 
                key={insurance.id} 
                className="bg-gray-50 p-4 rounded-lg flex items-center"
              >
                <Check size={18} className="text-green-500 mr-3 shrink-0" />
                <span>{insurance.name}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-yellow-500 mr-3 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Importante</h3>
                <p className="text-yellow-700 text-sm">
                  A cobertura e os procedimentos disponíveis podem variar de acordo com o plano de cada convênio. Recomendamos verificar antecipadamente com seu plano de saúde a cobertura para o procedimento desejado.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Caso seu convênio não esteja listado, entre em contato conosco para verificar a possibilidade de atendimento.
          </p>
          <p className="text-gray-600">
            Também oferecemos atendimento particular com condições especiais. Consulte nossos valores.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Perguntas Frequentes</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <HelpCircle size={18} className="text-primary-700 mr-2" />
                  Como sei se meu plano cobre a consulta ou procedimento?
                </h3>
                <p className="text-gray-600 pl-7">
                  Você pode verificar a cobertura diretamente com seu convênio ou entrar em contato com nossa central de atendimento. Teremos prazer em ajudar a verificar a cobertura do seu plano.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <HelpCircle size={18} className="text-primary-700 mr-2" />
                  Preciso de autorização prévia para consultas?
                </h3>
                <p className="text-gray-600 pl-7">
                  Alguns convênios exigem autorização prévia para consultas e procedimentos. Recomendamos verificar as regras específicas do seu plano de saúde.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <HelpCircle size={18} className="text-primary-700 mr-2" />
                  O que devo levar no dia da consulta?
                </h3>
                <p className="text-gray-600 pl-7">
                  Carteira do convênio, documento de identidade, exames anteriores relacionados à queixa e, se necessário, pedido médico ou autorização do convênio.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <HelpCircle size={18} className="text-primary-700 mr-2" />
                  E se eu não tiver convênio?
                </h3>
                <p className="text-gray-600 pl-7">
                  Oferecemos atendimento particular com valores acessíveis. Entre em contato para conhecer nossas condições especiais e pacotes de tratamento.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Entre em Contato</h2>
            
            <p className="text-gray-600 mb-6">
              Para mais informações sobre convênios, cobertura, valores ou para agendar sua consulta, entre em contato conosco:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">(98) 3232-0000</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="font-medium">contato@incom-slz.com.br</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">Av. Principal, 1234, Centro</p>
                  <p className="text-gray-600">São Luís - MA, 65000-000</p>
                </div>
              </div>
            </div>
            
            <form className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="input-field"
                  placeholder="Digite seu nome"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="Digite seu e-mail"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="input-field"
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Enviar mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage;