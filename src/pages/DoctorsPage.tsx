import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Stethoscope } from 'lucide-react';
import { doctors as fallbackDoctors, type Doctor as FallbackDoctor } from '../data/doctors';
import { supabase } from '../lib/supabase';
import type { Doctor } from '../lib/database.types';

type PublicDoctor = Doctor | FallbackDoctor;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<PublicDoctor[]>(fallbackDoctors);

  useEffect(() => {
    supabase.from('doctors').select('*').eq('is_active', true).order('name').then(({ data, error }) => {
      if (error) {
        console.error('doctors load failed', error);
        return;
      }
      if (data && data.length > 0) setDoctors(data as Doctor[]);
    });
  }, []);

  return <div className="min-h-screen bg-gray-50 pt-24 pb-16"><div className="container"><h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nossa Equipe Médica</h1><p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">Conheça os especialistas que fazem parte da nossa equipe, profissionais qualificados e dedicados à sua saúde.</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">{doctors.map((doctor) => { const image = 'photo_url' in doctor ? doctor.photo_url : doctor.image; const biography = 'bio' in doctor ? doctor.bio : doctor.biography; const education = 'education' in doctor ? doctor.education : []; return <div key={doctor.id} id={doctor.id} className="card overflow-hidden group"><div className="h-64 overflow-hidden bg-[#e9f4f0]">{image ? <img src={image} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-[#087b63]"><Stethoscope size={44} /></div>}</div><div className="p-6"><h3 className="text-xl font-semibold mb-1">{doctor.name}</h3><p className="text-secondary-600 mb-2">{doctor.specialty}</p>{'crm' in doctor && <p className="text-xs text-slate-500 mb-4">{doctor.crm}</p>}<p className="text-gray-600 mb-4 text-sm line-clamp-3">{biography || 'Especialista da equipe Incom, dedicado a um cuidado individualizado.'}</p>{education.length > 0 && <div className="mb-4"><h4 className="font-semibold text-sm mb-2">Formação</h4><ul className="text-sm text-gray-600 space-y-1">{education.map((item) => <li key={item} className="flex items-start"><span className="text-secondary-600 mr-2">•</span>{item}</li>)}</ul></div>}<div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100"><Link to="/appointment" className="btn btn-sm btn-primary py-2 px-4 text-sm flex items-center"><Phone size={14} className="mr-1" />Agendar</Link><a href="mailto:contato@incom-slz.com.br" className="text-primary-700 hover:text-secondary-600 flex items-center text-sm"><Mail size={14} className="mr-1" />Contato</a></div></div></div>; })}</div><div className="bg-white p-8 rounded-2xl border border-slate-200"><h2 className="text-2xl font-semibold mb-6">Sobre nossa equipe</h2><p className="text-gray-600 mb-4">A Incom conta com uma equipe médica qualificada e especializada em diversas áreas da ortopedia e medicina da dor.</p><p className="text-gray-600">Unimos conhecimento técnico, atualização constante e cuidado humanizado para construir uma experiência segura em cada etapa.</p></div></div></div>;
};

export default DoctorsPage;
