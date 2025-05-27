import React, { useState } from 'react';
import { specialties } from '../data/specialties';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

enum AppointmentType {
  SPECIALTY = 'specialty',
  DOCTOR = 'doctor'
}

enum AppointmentStep {
  SELECT_TYPE = 0,
  SELECT_SPECIALTY = 1,
  SELECT_DATE_TIME = 2,
  PERSONAL_INFO = 3,
  CONFIRMATION = 4
}

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  insurance: string;
  appointmentType: 'online' | 'inperson';
  phone: string;
}

const AppointmentPage: React.FC = () => {
  const [appointmentType, setAppointmentType] = useState<AppointmentType | null>(null);
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(AppointmentStep.SELECT_TYPE);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    birthDate: '',
    insurance: '',
    appointmentType: 'inperson',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSpecialtySelect = (specialtyId: string) => {
    setSelectedSpecialty(specialtyId);
    setCurrentStep(AppointmentStep.SELECT_DATE_TIME);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const specialtyData = getSelectedSpecialtyData();
    if (!specialtyData) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          appointmentData: {
            ...personalInfo,
            specialty: specialtyData.name,
            date: selectedDay,
            time: selectedTime,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar agendamento');
      }

      setCurrentStep(AppointmentStep.CONFIRMATION);
    } catch (error) {
      setSubmitError('Ocorreu um erro ao processar seu agendamento. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedSpecialtyData = () => {
    return specialties.find(s => s.id === selectedSpecialty) || null;
  };

  const specialtyData = getSelectedSpecialtyData();

  const renderStep = () => {
    switch (currentStep) {
      case AppointmentStep.SELECT_TYPE:
        return (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Como deseja agendar sua consulta?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setAppointmentType(AppointmentType.SPECIALTY);
                  setCurrentStep(AppointmentStep.SELECT_SPECIALTY);
                }}
                className="bg-white p-8 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-secondary-500"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-primary-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Por Especialidade</h3>
                <p className="text-gray-600">
                  Selecione a especialidade desejada e veja os horários disponíveis
                </p>
              </button>
              
              <a
                href="https://www.incom-slz.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-secondary-500"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-primary-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Por Médico Específico</h3>
                <p className="text-gray-600">
                  Escolha o médico de sua preferência para agendar sua consulta
                </p>
              </a>
            </div>
          </div>
        );
        
      case AppointmentStep.SELECT_SPECIALTY:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Selecione a especialidade desejada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialties.map(specialty => (
                <button
                  key={specialty.id}
                  onClick={() => handleSpecialtySelect(specialty.id)}
                  className="bg-white p-6 rounded-lg shadow-md text-left transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-secondary-500"
                >
                  <h3 className="text-xl font-semibold mb-2">{specialty.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {specialty.description.slice(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(specialty.availability).map(day => (
                      <span key={day} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                        {day}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentStep(AppointmentStep.SELECT_TYPE)}
                className="text-primary-700 font-medium hover:text-secondary-600 flex items-center mx-auto"
              >
                <ChevronRight size={16} className="mr-2 rotate-180" />
                Voltar
              </button>
            </div>
          </div>
        );
        
      case AppointmentStep.SELECT_DATE_TIME:
        if (!specialtyData) return <div>Especialidade não encontrada</div>;
        
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-center">{specialtyData.name}</h2>
            <p className="text-gray-600 text-center mb-8">{specialtyData.description}</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-4">Selecione o dia</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {Object.keys(specialtyData.availability).map(day => (
                  <button
                    key={day}
                    onClick={() => handleDaySelect(day)}
                    className={`p-3 rounded-md text-center transition-colors ${
                      selectedDay === day 
                        ? 'bg-primary-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {day}
                    <div className="text-xs mt-1">
                      {specialtyData.availability[day].join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {selectedDay && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">Selecione o horário</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {specialtyData.hours[selectedDay].map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 rounded-md text-center transition-colors ${
                        selectedTime === time 
                          ? 'bg-secondary-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTime && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(AppointmentStep.PERSONAL_INFO)}
                  className="btn btn-primary"
                >
                  Continuar
                </button>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentStep(AppointmentStep.SELECT_SPECIALTY)}
                className="text-primary-700 font-medium hover:text-secondary-600 flex items-center mx-auto"
              >
                <ChevronRight size={16} className="mr-2 rotate-180" />
                Voltar
              </button>
            </div>
          </div>
        );
        
      case AppointmentStep.PERSONAL_INFO:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Informações Pessoais</h2>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className="input-field"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="birthDate" className="form-label">Data de Nascimento</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    required
                    className="input-field"
                    value={personalInfo.birthDate}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="insurance" className="form-label">Convênio ou Particular</label>
                  <select
                    id="insurance"
                    name="insurance"
                    required
                    className="input-field"
                    value={personalInfo.insurance}
                    onChange={handlePersonalInfoChange}
                  >
                    <option value="">Selecione</option>
                    <option value="particular">Particular</option>
                    <optgroup label="Convênios">
                      <option value="AMIL">AMIL</option>
                      <option value="ASSEFAZ">ASSEFAZ</option>
                      <option value="CAMED">CAMED</option>
                      <option value="CASF">CASF</option>
                      <option value="CASSI">CASSI</option>
                      <option value="CAPESAUDE">CAPESAUDE</option>
                      <option value="CENTRAL NACIONAL UNIMED">CENTRAL NACIONAL UNIMED</option>
                      <option value="CONAB">CONAB</option>
                      <option value="E-VIDA">E-VIDA</option>
                      <option value="GEAP">GEAP</option>
                      <option value="MEDISERVICE">MEDISERVICE</option>
                      <option value="POSTAL SAÚDE">POSTAL SAÚDE</option>
                      <option value="SAÚDE BRADESCO">SAÚDE BRADESCO</option>
                      <option value="SAÚDE CAIXA">SAÚDE CAIXA</option>
                      <option value="SULAMERICA">SULAMERICA</option>
                      <option value="UNIMED SEGUROS">UNIMED SEGUROS</option>
                      <option value="VALE E PASA">VALE E PASA</option>
                      <option value="VERITAS">VERITAS</option>
                    </optgroup>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Tipo de Consulta</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="inperson"
                        checked={personalInfo.appointmentType === 'inperson'}
                        onChange={handlePersonalInfoChange}
                        className="mr-2"
                      />
                      Presencial
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentType"
                        value="online"
                        checked={personalInfo.appointmentType === 'online'}
                        onChange={handlePersonalInfoChange}
                        className="mr-2"
                      />
                      Online
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Telefone para Contato</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="input-field"
                    placeholder="(99) 99999-9999"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                </div>
                
                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(AppointmentStep.SELECT_DATE_TIME)}
                    className="text-primary-700 font-medium hover:text-secondary-600 flex items-center"
                  >
                    <ChevronRight size={16} className="mr-2 rotate-180" />
                    Voltar
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processando...' : 'Finalizar Agendamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
        
      case AppointmentStep.CONFIRMATION:
        if (!specialtyData) return <div>Especialidade não encontrada</div>;
        
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-center">Agendamento Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Obrigado por agendar sua consulta na Incom. Em breve entraremos em contato para confirmar seu atendimento.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-lg mb-4 text-left">Detalhes do Agendamento:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-500">Especialidade</p>
                    <p className="font-medium">{specialtyData.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Data e Horário</p>
                    <p className="font-medium">{selectedDay}, {selectedTime}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Paciente</p>
                    <p className="font-medium">{personalInfo.fullName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Convênio</p>
                    <p className="font-medium">{personalInfo.insurance || 'Particular'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Consulta</p>
                    <p className="font-medium">
                      {personalInfo.appointmentType === 'inperson' ? 'Presencial' : 'Online'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{personalInfo.phone}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-8">
                Um comprovante com os detalhes da sua consulta foi enviado para o seu telefone. Caso precise reagendar ou cancelar, entre em contato pelo nosso telefone (98) 3232-0000.
              </p>
              
              <a href="/" className="btn btn-primary">
                Voltar para a Página Inicial
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Agendar Consulta</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Agende sua consulta de forma rápida e prática. Escolha a especialidade ou médico de sua preferência.
        </p>
        
        {currentStep < AppointmentStep.CONFIRMATION && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {[
                'Tipo de Agendamento',
                'Especialidade',
                'Data e Horário',
                'Informações Pessoais'
              ].map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= index 
                        ? 'bg-primary-700 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${
                      currentStep >= index 
                        ? 'text-primary-700 font-medium' 
                        : 'text-gray-500'
                    } hidden sm:block`}>
                      {step}
                    </span>
                  </div>
                  
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      currentStep > index ? 'bg-primary-700' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {submitError && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {submitError}
            </div>
          </div>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
};

export default AppointmentPage;