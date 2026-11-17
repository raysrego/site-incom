import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Stethoscope, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AppointmentType, Availability, Doctor } from '../lib/database.types';

interface PatientForm {
  name: string;
  birthDate: string;
  insurance: string;
  phone: string;
  email: string;
  notes: string;
}

const initialPatient: PatientForm = { name: '', birthDate: '', insurance: '', phone: '', email: '', notes: '' };
const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const AppointmentPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('inperson');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [patient, setPatient] = useState<PatientForm>(initialPatient);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('doctors').select('*').eq('is_active', true).order('name'),
      supabase.from('doctor_availability').select('*').order('weekday').order('start_time'),
    ]).then(([doctorsResult, availabilityResult]) => {
      if (doctorsResult.error || availabilityResult.error) {
        console.error('appointment availability load failed', { doctorsResult, availabilityResult });
        setError('Não foi possível carregar os horários agora.');
      } else {
        setDoctors((doctorsResult.data ?? []) as Doctor[]);
        setAvailability((availabilityResult.data ?? []) as Availability[]);
      }
      setLoading(false);
    });
  }, []);

  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId) ?? null;
  const selectedDay = date ? new Date(`${date}T12:00:00`).getDay() : null;
  const dayAvailability = useMemo(() => availability.filter((item) => item.doctor_id === doctorId && item.weekday === selectedDay && item.location_type === appointmentType), [availability, appointmentType, doctorId, selectedDay]);
  const availableTimes = useMemo(() => {
    const slots: string[] = [];
    dayAvailability.forEach((block) => {
      const [startHour, startMinute] = block.start_time.split(':').map(Number);
      const [endHour, endMinute] = block.end_time.split(':').map(Number);
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;
      for (let minute = start; minute + block.slot_duration_minutes <= end; minute += block.slot_duration_minutes) {
        const slot = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
        if (!slots.includes(slot)) slots.push(slot);
      }
    });
    return slots;
  }, [dayAvailability]);

  const chooseType = (type: AppointmentType) => {
    setAppointmentType(type);
    setDate('');
    setTime('');
    setStep(2);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!doctorId || !date || !time) return;
    setSubmitting(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc('create_public_appointment', {
      p_doctor_id: doctorId,
      p_appointment_date: date,
      p_start_time: time,
      p_appointment_type: appointmentType,
      p_patient_name: patient.name,
      p_patient_birth_date: patient.birthDate,
      p_patient_insurance: patient.insurance,
      p_patient_phone: patient.phone,
      p_patient_email: patient.email || null,
      p_patient_notes: patient.notes || null,
    });
    if (rpcError) {
      console.error('appointment creation failed', rpcError);
      setError('Este horário pode ter acabado de ser reservado. Escolha outro e tente novamente.');
    } else {
      setConfirmed(true);
      setStep(4);
    }
    setSubmitting(false);
  };

  if (confirmed) return <Confirmation doctor={selectedDoctor} date={date} time={time} appointmentType={appointmentType} patientName={patient.name} />;

  return <main className="pt-28 pb-20 bg-[#f3f7f6] min-h-screen"><div className="container"><div className="max-w-3xl mx-auto text-center mb-12"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#087b63]">Cuidado no seu tempo</p><h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Agende sua consulta</h1><p className="mt-5 text-slate-500 leading-7">Escolha o formato, encontre um horário e envie seus dados para a equipe Incom.</p></div>{error && <div className="max-w-3xl mx-auto mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}<div className="max-w-5xl mx-auto mb-10 flex items-center justify-between"><Step number={1} label="Formato" active={step >= 1} /><Line active={step > 1} /><Step number={2} label="Horário" active={step >= 2} /><Line active={step > 2} /><Step number={3} label="Seus dados" active={step >= 3} /></div>{loading ? <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">Carregando médicos e horários...</div> : <>{step === 1 && <section className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5"><TypeCard icon={Stethoscope} title="Consulta presencial" description="Atendimento no ambiente acolhedor da clínica." onClick={() => chooseType('inperson')} /><TypeCard icon={Video} title="Consulta online" description="Converse com seu médico com segurança pelo navegador." onClick={() => chooseType('online')} /></section>}{step === 2 && <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"><div className="flex items-center justify-between mb-7"><div><h2 className="text-xl font-semibold">Escolha o médico e horário</h2><p className="text-sm text-slate-500 mt-1">{appointmentType === 'online' ? 'Horários disponíveis para consulta online.' : 'Horários disponíveis na clínica.'}</p></div><button onClick={() => setStep(1)} className="text-sm font-semibold text-[#087b63] inline-flex items-center gap-1"><ChevronLeft size={16} /> Voltar</button></div><div className="space-y-5"><label className="block"><span className="form-label">Médico</span><select className="input-field" value={doctorId} onChange={(event) => { setDoctorId(event.target.value); setDate(''); setTime(''); }}><option value="">Selecione o médico</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} · {doctor.specialty}</option>)}</select></label><label className="block"><span className="form-label">Data</span><input className="input-field" type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => { setDate(event.target.value); setTime(''); }} disabled={!doctorId} /></label>{doctorId && date && <div><p className="form-label">Horários de {weekDays[selectedDay ?? 0].toLowerCase()}</p>{availableTimes.length === 0 ? <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700">Não há horários disponíveis para este dia. Escolha outra data.</div> : <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">{availableTimes.map((slot) => <button key={slot} onClick={() => setTime(slot)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${time === slot ? 'border-[#087b63] bg-[#087b63] text-white' : 'border-slate-200 hover:border-[#087b63] text-slate-700'}`}>{slot}</button>)}</div>}</div>}<button disabled={!doctorId || !date || !time} onClick={() => setStep(3)} className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40">Continuar <ChevronRight size={17} /></button></div></section>}{step === 3 && <section className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8"><div className="flex items-center justify-between mb-7"><div><h2 className="text-xl font-semibold">Seus dados</h2><p className="text-sm text-slate-500 mt-1">Precisamos dessas informações para receber seu pedido.</p></div><button onClick={() => setStep(2)} className="text-sm font-semibold text-[#087b63] inline-flex items-center gap-1"><ChevronLeft size={16} /> Voltar</button></div><form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4"><label className="sm:col-span-2"><span className="form-label">Nome completo</span><input className="input-field" value={patient.name} onChange={(event) => setPatient({ ...patient, name: event.target.value })} required /></label><label><span className="form-label">Data de nascimento</span><input className="input-field" type="date" value={patient.birthDate} onChange={(event) => setPatient({ ...patient, birthDate: event.target.value })} required /></label><label><span className="form-label">Telefone</span><input className="input-field" type="tel" value={patient.phone} onChange={(event) => setPatient({ ...patient, phone: event.target.value })} required /></label><label className="sm:col-span-2"><span className="form-label">Convênio ou particular</span><input className="input-field" placeholder="Ex.: Unimed ou Particular" value={patient.insurance} onChange={(event) => setPatient({ ...patient, insurance: event.target.value })} required /></label><label className="sm:col-span-2"><span className="form-label">E-mail (opcional)</span><input className="input-field" type="email" value={patient.email} onChange={(event) => setPatient({ ...patient, email: event.target.value })} /></label><label className="sm:col-span-2"><span className="form-label">Observação (opcional)</span><textarea className="input-field min-h-24" value={patient.notes} onChange={(event) => setPatient({ ...patient, notes: event.target.value })} /></label><div className="sm:col-span-2 rounded-xl bg-[#f3f7f6] p-4 text-sm text-slate-600"><p className="font-semibold text-[#102b3d]">Resumo</p><p className="mt-2">{selectedDoctor?.name} · {date && new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`))} às {time} · {appointmentType === 'online' ? 'Online' : 'Presencial'}</p></div><button className="sm:col-span-2 btn btn-primary w-full" disabled={submitting}>{submitting ? 'Enviando pedido...' : 'Enviar pedido de agendamento'}</button></form></section>}</>}</div></main>;
};

function Step({ number, label, active }: { number: number; label: string; active: boolean }) { return <div className={`flex flex-col items-center gap-2 ${active ? 'text-[#087b63]' : 'text-slate-400'}`}><div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ${active ? 'bg-[#087b63] text-white' : 'bg-slate-200'}`}>{number}</div><span className="text-xs sm:text-sm font-semibold">{label}</span></div>; }
function Line({ active }: { active: boolean }) { return <div className={`h-px flex-1 mx-3 sm:mx-6 ${active ? 'bg-[#087b63]' : 'bg-slate-200'}`} />; }
function TypeCard({ icon: Icon, title, description, onClick }: { icon: typeof Stethoscope; title: string; description: string; onClick: () => void }) { return <button onClick={onClick} className="text-left bg-white border border-slate-200 rounded-2xl p-7 hover:border-[#087b63] hover:-translate-y-1 transition-all group"><div className="h-12 w-12 rounded-xl bg-[#e9f4f0] text-[#087b63] flex items-center justify-center group-hover:bg-[#087b63] group-hover:text-white transition-colors"><Icon size={22} /></div><h2 className="mt-7 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#087b63]">Escolher <ChevronRight size={16} /></span></button>; }
function Confirmation({ doctor, date, time, appointmentType, patientName }: { doctor: Doctor | null; date: string; time: string; appointmentType: AppointmentType; patientName: string }) { return <main className="pt-32 pb-20 bg-[#f3f7f6] min-h-screen"><div className="max-w-2xl mx-auto px-4"><section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center"><div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto"><Check size={30} /></div><p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-[#087b63]">Pedido recebido</p><h1 className="mt-3 text-3xl font-semibold">Tudo certo, {patientName.split(' ')[0]}.</h1><p className="mt-4 text-slate-500 leading-7">A equipe Incom recebeu sua solicitação e entrará em contato para confirmar o atendimento.</p><div className="mt-8 rounded-xl bg-[#f3f7f6] p-5 text-left"><p className="text-sm text-slate-500">Consulta solicitada</p><p className="mt-2 font-semibold">{doctor?.name}</p><p className="mt-1 text-sm text-slate-600">{date && new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`))} · {time} · {appointmentType === 'online' ? 'Online' : 'Presencial'}</p></div><a href="/" className="btn btn-primary mt-8 inline-flex">Voltar ao início</a></section></div></main>; }

export default AppointmentPage;
