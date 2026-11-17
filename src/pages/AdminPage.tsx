import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, CalendarDays, Check, ChevronRight, Clock3, FilePenLine, LogOut, Plus, Save, Settings2, ShieldCheck, Stethoscope, UserRound, Users, Video, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Appointment, AppointmentStatus, Availability, BlogPost, Doctor, SiteContent } from '../lib/database.types';

interface AppointmentView extends Appointment {
  doctors: { name: string; specialty: string } | null;
}

type AdminTab = 'overview' | 'appointments' | 'doctors' | 'schedule' | 'content';

const weekDays = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Aguardando',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
  no_show: 'Não compareceu',
};

const formatDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${value}T12:00:00`));
const formatTime = (value: string) => value.slice(0, 5);

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut, claimInitialAdmin, refreshProfile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [appointments, setAppointments] = useState<AppointmentView[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedContent, setSelectedContent] = useState<SiteContent | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ name: '', crm: '', specialty: '', email: '', password: '', photoUrl: '' });
  const [scheduleForm, setScheduleForm] = useState({ doctorId: '', weekday: '1', startTime: '08:00', endTime: '12:00', duration: '30', type: 'inperson' as 'inperson' | 'online' });

  const loadData = useCallback(async () => {
    if (!user || !profile) return;
    setIsLoading(true);
    setError(null);
    const doctorsQuery = isAdmin
      ? supabase.from('doctors').select('*').order('name')
      : supabase.from('doctors').select('*').eq('user_id', user.id);
    const availabilityQuery = isAdmin
      ? supabase.from('doctor_availability').select('*').order('weekday').order('start_time')
      : supabase.from('doctor_availability').select('*').order('weekday').order('start_time');
    const appointmentsQuery = supabase.from('appointments').select('*, doctors(name, specialty)').order('appointment_date').order('start_time');
    const [doctorsResult, availabilityResult, appointmentsResult, contentResult, postsResult] = await Promise.all([
      doctorsQuery,
      availabilityQuery,
      appointmentsQuery,
      isAdmin ? supabase.from('site_content').select('*').order('slug') : Promise.resolve({ data: [], error: null }),
      isAdmin ? supabase.from('blog_posts').select('*').order('updated_at', { ascending: false }) : Promise.resolve({ data: [], error: null }),
    ]);
    if (doctorsResult.error || availabilityResult.error || appointmentsResult.error || contentResult.error || postsResult.error) {
      console.error('admin data load failed', { doctorsResult, availabilityResult, appointmentsResult, contentResult, postsResult });
      setError('Não foi possível carregar os dados do painel.');
    } else {
      setDoctors((doctorsResult.data ?? []) as Doctor[]);
      setAvailability((availabilityResult.data ?? []) as Availability[]);
      setAppointments((appointmentsResult.data ?? []) as unknown as AppointmentView[]);
      setContent((contentResult.data ?? []) as SiteContent[]);
      setPosts((postsResult.data ?? []) as BlogPost[]);
    }
    setIsLoading(false);
  }, [isAdmin, profile, user]);

  useEffect(() => {
    if (!authLoading && user && profile) void loadData();
    if (!authLoading && !user) navigate('/acesso', { replace: true });
  }, [authLoading, loadData, navigate, profile, user]);

  useEffect(() => {
    if (!scheduleForm.doctorId && doctors[0]) setScheduleForm((current) => ({ ...current, doctorId: doctors[0].id }));
  }, [doctors, scheduleForm.doctorId]);

  const upcomingAppointments = useMemo(() => appointments.filter((appointment) => appointment.status !== 'cancelled' && appointment.appointment_date >= new Date().toISOString().slice(0, 10)), [appointments]);
  const pendingCount = appointments.filter((appointment) => appointment.status === 'pending').length;
  const onlineCount = upcomingAppointments.filter((appointment) => appointment.appointment_type === 'online').length;

  const handleStatus = async (appointmentId: string, status: AppointmentStatus) => {
    const { error: updateError } = await supabase.from('appointments').update({ status }).eq('id', appointmentId);
    if (updateError) {
      console.error('appointment status update failed', updateError);
      setError('Não foi possível atualizar o agendamento.');
    } else {
      setNotice('Agendamento atualizado.');
      await loadData();
    }
  };

  const handleCreateDoctor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const { data, error: functionError } = await supabase.functions.invoke('create-doctor-account', { body: doctorForm });
    if (functionError || !data?.doctor) {
      console.error('doctor creation failed', functionError);
      setError('Não foi possível cadastrar o médico. Confira os dados e tente novamente.');
      return;
    }
    setDoctorForm({ name: '', crm: '', specialty: '', email: '', password: '', photoUrl: '' });
    setShowDoctorForm(false);
    setNotice('Médico cadastrado e acesso criado com sucesso.');
    await loadData();
  };

  const handleCreateSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!scheduleForm.doctorId) return;
    const { error: insertError } = await supabase.from('doctor_availability').insert({
      doctor_id: scheduleForm.doctorId,
      weekday: Number(scheduleForm.weekday),
      start_time: scheduleForm.startTime,
      end_time: scheduleForm.endTime,
      slot_duration_minutes: Number(scheduleForm.duration),
      location_type: scheduleForm.type,
    });
    if (insertError) {
      console.error('schedule creation failed', insertError);
      setError('Não foi possível salvar este horário.');
    } else {
      setNotice('Horário adicionado à agenda.');
      await loadData();
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    const { error: deleteError } = await supabase.from('doctor_availability').delete().eq('id', id);
    if (deleteError) {
      console.error('schedule deletion failed', deleteError);
      setError('Não foi possível remover o horário.');
    } else {
      setNotice('Horário removido.');
      await loadData();
    }
  };

  const handleSaveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedContent || !user) return;
    const { error: updateError } = await supabase.from('site_content').update({ title: selectedContent.title, intro: selectedContent.intro, body: selectedContent.body, updated_by: user.id }).eq('id', selectedContent.id);
    if (updateError) {
      console.error('content update failed', updateError);
      setError('Não foi possível salvar o conteúdo.');
    } else {
      setNotice('Conteúdo atualizado.');
      setSelectedContent(null);
      await loadData();
    }
  };

  const handleSavePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPost || !user) return;
    const payload = { title: selectedPost.title, excerpt: selectedPost.excerpt, content: selectedPost.content, author_name: selectedPost.author_name, published: selectedPost.published, updated_by: user.id, published_at: selectedPost.published ? selectedPost.published_at ?? new Date().toISOString() : null };
    const query = selectedPost.id ? supabase.from('blog_posts').update(payload).eq('id', selectedPost.id) : supabase.from('blog_posts').insert({ ...payload, slug: selectedPost.slug });
    const { error: updateError } = await query;
    if (updateError) {
      console.error('post update failed', updateError);
      setError('Não foi possível salvar o artigo.');
    } else {
      setNotice('Artigo atualizado.');
      setSelectedPost(null);
      await loadData();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/acesso');
  };

  const handleClaimInitialAdmin = async () => {
    const result = await claimInitialAdmin();
    if (result) setError(result);
    else {
      setNotice('Acesso administrativo ativado.');
      await refreshProfile();
    }
  };

  if (authLoading || isLoading) return <div className="min-h-screen bg-[#f3f7f6] flex items-center justify-center text-slate-500">Carregando painel...</div>;
  if (!user || !profile) return null;

  const navItems: { id: AdminTab; label: string; icon: typeof Activity }[] = isAdmin
    ? [
        { id: 'overview', label: 'Visão geral', icon: Activity },
        { id: 'appointments', label: 'Agendamentos', icon: CalendarDays },
        { id: 'doctors', label: 'Médicos', icon: Users },
        { id: 'schedule', label: 'Agenda', icon: Clock3 },
        { id: 'content', label: 'Conteúdo', icon: FilePenLine },
      ]
    : [
        { id: 'overview', label: 'Minha agenda', icon: Activity },
        { id: 'appointments', label: 'Recebimentos', icon: CalendarDays },
      ];

  return (
    <div className="min-h-screen bg-[#f3f7f6] text-[#102b3d] flex">
      <aside className="hidden lg:flex w-72 shrink-0 bg-[#061724] text-white flex-col p-6">
        <Link to="/" className="flex items-center gap-3 px-2">
          <img src="/Logo_Incom_branca_(1).png" alt="Incom" className="h-11 w-auto object-contain" />
        </Link>
        <div className="mt-12 rounded-2xl bg-white/8 border border-white/10 p-4">
          <div className="h-10 w-10 rounded-xl bg-[#087b63] flex items-center justify-center mb-4"><UserRound size={18} /></div>
          <p className="font-semibold truncate">{profile.full_name || user.email}</p>
          <p className="text-xs text-white/50 mt-1">{isAdmin ? 'Administrador da clínica' : 'Acesso médico'}</p>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition-colors ${activeTab === item.id ? 'bg-white text-[#102b3d]' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}><Icon size={18} />{item.label}</button>;
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-white/65 hover:text-white"><ChevronRight size={17} className="rotate-180" /> Voltar ao site</Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/65 hover:text-white"><LogOut size={17} /> Sair do painel</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-200 px-5 sm:px-8 py-5 flex items-center justify-between lg:justify-end">
          <img src="/Logo_Incom_branca_(1).png" alt="Incom" className="lg:hidden h-9 w-auto bg-[#061724] rounded-lg px-2" />
          <div className="flex items-center gap-3"><span className="hidden sm:flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-[#087b63]" /> Ambiente protegido</span><button onClick={handleSignOut} className="lg:hidden p-2 text-slate-500"><LogOut size={18} /></button></div>
        </header>

        <div className="p-5 sm:p-8 max-w-[1500px] mx-auto">
          <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#087b63]">{isAdmin ? 'Operação da clínica' : 'Área médica'}</p><h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">{navItems.find((item) => item.id === activeTab)?.label}</h1><p className="mt-2 text-slate-500">{isAdmin ? 'Acompanhe o fluxo de atendimento e mantenha tudo organizado.' : 'Veja apenas os atendimentos e horários destinados a você.'}</p></div>
          {notice && <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2"><Check size={16} /> {notice}</div>}
          {error && <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 flex items-center gap-2"><X size={16} /> {error}</div>}
          {!isAdmin && <div className="mb-6 rounded-2xl border border-[#b9e5d7] bg-[#effaf6] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><p className="font-semibold text-[#102b3d]">Primeiro acesso da clínica?</p><p className="text-sm text-slate-600 mt-1">Se você é responsável pela operação e ainda não existe administrador, ative esse perfil agora.</p></div><button onClick={handleClaimInitialAdmin} className="btn btn-primary whitespace-nowrap">Ativar administrador</button></div>}

          {activeTab === 'overview' && <Overview appointments={upcomingAppointments} doctors={doctors} pendingCount={pendingCount} onlineCount={onlineCount} isAdmin={isAdmin} onOpenAppointments={() => setActiveTab('appointments')} />}
          {activeTab === 'appointments' && <Appointments appointments={appointments} isAdmin={isAdmin} onStatus={handleStatus} onOpenVideo={(id) => navigate(`/admin/teleconsulta/${id}`)} />}
          {activeTab === 'doctors' && isAdmin && <Doctors doctors={doctors} onAdd={() => setShowDoctorForm(true)} />}
          {activeTab === 'schedule' && isAdmin && <Schedule doctors={doctors} availability={availability} form={scheduleForm} onChange={setScheduleForm} onSubmit={handleCreateSchedule} onDelete={handleDeleteSchedule} />}
          {activeTab === 'content' && isAdmin && <ContentManager content={content} posts={posts} selectedContent={selectedContent} selectedPost={selectedPost} onSelectContent={setSelectedContent} onSelectPost={setSelectedPost} onNewPost={() => setSelectedPost({ id: '', slug: `novo-artigo-${Date.now()}`, title: '', excerpt: '', content: '', author_name: profile.full_name || 'Equipe Incom', cover_image: null, tags: [], published: false, published_at: null, updated_by: user.id, created_at: '', updated_at: '' })} onSaveContent={handleSaveContent} onSavePost={handleSavePost} />}
        </div>
      </main>

      {showDoctorForm && <DoctorForm form={doctorForm} onChange={setDoctorForm} onSubmit={handleCreateDoctor} onClose={() => setShowDoctorForm(false)} />}
    </div>
  );
};

function Overview({ appointments, doctors, pendingCount, onlineCount, isAdmin, onOpenAppointments }: { appointments: AppointmentView[]; doctors: Doctor[]; pendingCount: number; onlineCount: number; isAdmin: boolean; onOpenAppointments: () => void }) {
  return <div className="space-y-8"><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4"><Metric label={isAdmin ? 'Médicos ativos' : 'Próximos atendimentos'} value={isAdmin ? doctors.filter((doctor) => doctor.is_active).length : appointments.length} icon={Stethoscope} /><Metric label="Aguardando confirmação" value={pendingCount} icon={Clock3} accent="amber" /><Metric label="Consultas online" value={onlineCount} icon={Video} accent="blue" /><Metric label="Hoje" value={appointments.filter((appointment) => appointment.appointment_date === new Date().toISOString().slice(0, 10)).length} icon={CalendarDays} accent="green" /></div><div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-6"><section className="bg-white border border-slate-200 rounded-2xl p-6"><div className="flex items-start justify-between gap-4 mb-6"><div><h2 className="text-lg font-semibold">Próximos atendimentos</h2><p className="text-sm text-slate-500 mt-1">A fila mais recente da sua operação.</p></div><button onClick={onOpenAppointments} className="text-sm font-semibold text-[#087b63]">Ver todos</button></div>{appointments.length === 0 ? <EmptyState text="Nenhum atendimento próximo." /> : <div className="space-y-3">{appointments.slice(0, 5).map((appointment) => <AppointmentRow key={appointment.id} appointment={appointment} />)}</div>}</section><section className="bg-[#102b3d] text-white rounded-2xl p-6"><div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center mb-7"><ShieldCheck size={20} /></div><h2 className="text-xl font-semibold">Cuidado também é organização.</h2><p className="mt-3 text-sm leading-6 text-white/65">A agenda centralizada ajuda a equipe a responder mais rápido e reduz conflitos de horário.</p><div className="mt-8 pt-5 border-t border-white/10 text-sm text-white/60">Acesso separado por função e visibilidade somente do necessário.</div></section></div></div>;
}

function Metric({ label, value, icon: Icon, accent = 'green' }: { label: string; value: number; icon: typeof Activity; accent?: 'green' | 'amber' | 'blue' }) { const color = { green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-sky-50 text-sky-700' }[accent]; return <div className="bg-white border border-slate-200 rounded-2xl p-5"><div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div><p className="mt-5 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div>; }

function Appointments({ appointments, isAdmin, onStatus, onOpenVideo }: { appointments: AppointmentView[]; isAdmin: boolean; onStatus: (id: string, status: AppointmentStatus) => void; onOpenVideo: (id: string) => void }) { return <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden"><div className="p-6 border-b border-slate-100"><h2 className="text-lg font-semibold">Agendamentos recebidos</h2><p className="text-sm text-slate-500 mt-1">{isAdmin ? 'Todos os pedidos feitos pelos pacientes.' : 'Somente os atendimentos vinculados ao seu perfil.'}</p></div><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Paciente</th><th className="px-6 py-4">Data</th><th className="px-6 py-4">Médico</th><th className="px-6 py-4">Modalidade</th><th className="px-6 py-4">Status</th><th className="px-6 py-4"></th></tr></thead><tbody className="divide-y divide-slate-100">{appointments.map((appointment) => <tr key={appointment.id} className="hover:bg-slate-50/70"><td className="px-6 py-4"><p className="font-semibold text-sm">{appointment.patient_name}</p><p className="text-xs text-slate-500 mt-1">{appointment.patient_phone}</p></td><td className="px-6 py-4 text-sm"><p>{formatDate(appointment.appointment_date)}</p><p className="text-xs text-slate-500 mt-1">{formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}</p></td><td className="px-6 py-4 text-sm">{appointment.doctors?.name ?? '—'}<p className="text-xs text-slate-500 mt-1">{appointment.doctors?.specialty}</p></td><td className="px-6 py-4 text-sm">{appointment.appointment_type === 'online' ? <span className="inline-flex items-center gap-1.5 text-sky-700"><Video size={14} /> Online</span> : 'Presencial'}</td><td className="px-6 py-4"><StatusPill status={appointment.status} /></td><td className="px-6 py-4"><div className="flex items-center justify-end gap-2">{isAdmin && appointment.status === 'pending' && <><button onClick={() => onStatus(appointment.id, 'confirmed')} className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100" title="Confirmar"><Check size={16} /></button><button onClick={() => onStatus(appointment.id, 'cancelled')} className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100" title="Cancelar"><X size={16} /></button></>}{appointment.appointment_type === 'online' && appointment.status !== 'cancelled' && <button onClick={() => onOpenVideo(appointment.id)} className="p-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100" title="Abrir teleconsulta"><Video size={16} /></button>}</div></td></tr>)}</tbody></table>{appointments.length === 0 && <EmptyState text="Ainda não há agendamentos recebidos." />}</div></section>; }

function StatusPill({ status }: { status: AppointmentStatus }) { const styles: Record<AppointmentStatus, string> = { pending: 'bg-amber-50 text-amber-700', confirmed: 'bg-emerald-50 text-emerald-700', cancelled: 'bg-red-50 text-red-700', completed: 'bg-sky-50 text-sky-700', no_show: 'bg-slate-100 text-slate-600' }; return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{statusLabels[status]}</span>; }
function AppointmentRow({ appointment }: { appointment: AppointmentView }) { return <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"><div className="flex items-center gap-3 min-w-0"><div className="h-10 w-10 rounded-xl bg-[#e9f4f0] text-[#087b63] flex items-center justify-center shrink-0"><UserRound size={17} /></div><div className="min-w-0"><p className="font-semibold text-sm truncate">{appointment.patient_name}</p><p className="text-xs text-slate-500 mt-1 truncate">{appointment.doctors?.name} · {appointment.appointment_type === 'online' ? 'Online' : 'Presencial'}</p></div></div><div className="text-right shrink-0"><p className="text-sm font-semibold">{formatDate(appointment.appointment_date)}</p><p className="text-xs text-slate-500 mt-1">{formatTime(appointment.start_time)}</p></div></div>; }
function EmptyState({ text }: { text: string }) { return <div className="px-6 py-12 text-center text-sm text-slate-500">{text}</div>; }

function Doctors({ doctors, onAdd }: { doctors: Doctor[]; onAdd: () => void }) { return <section className="space-y-5"><div className="flex justify-end"><button onClick={onAdd} className="btn btn-primary flex items-center gap-2"><Plus size={17} /> Cadastrar médico</button></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{doctors.map((doctor) => <div key={doctor.id} className="bg-white border border-slate-200 rounded-2xl p-5"><div className="flex items-start gap-4"><div className="h-14 w-14 rounded-2xl overflow-hidden bg-[#e9f4f0] shrink-0">{doctor.photo_url ? <img src={doctor.photo_url} alt={doctor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#087b63]"><Stethoscope size={23} /></div>}</div><div><h3 className="font-semibold">{doctor.name}</h3><p className="mt-1 text-sm text-[#087b63]">{doctor.specialty}</p><p className="mt-2 text-xs text-slate-500">{doctor.crm}</p></div></div><div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs"><span className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${doctor.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{doctor.is_active ? 'Ativo' : 'Inativo'}</span><span className="text-slate-400">{doctor.user_id ? 'Acesso vinculado' : 'Sem acesso'}</span></div></div>)}</div></section>; }

function Schedule({ doctors, availability, form, onChange, onSubmit, onDelete }: { doctors: Doctor[]; availability: Availability[]; form: { doctorId: string; weekday: string; startTime: string; endTime: string; duration: string; type: 'inperson' | 'online' }; onChange: (value: typeof form) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onDelete: (id: string) => void }) { return <div className="grid xl:grid-cols-[0.8fr_1.2fr] gap-6"><section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="text-lg font-semibold">Novo bloco de horário</h2><p className="text-sm text-slate-500 mt-1 mb-6">Defina quando o paciente poderá encontrar este médico.</p><form onSubmit={onSubmit} className="space-y-4"><label className="block"><span className="form-label">Médico</span><select className="input-field" value={form.doctorId} onChange={(event) => onChange({ ...form, doctorId: event.target.value })}>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}</select></label><label className="block"><span className="form-label">Dia da semana</span><select className="input-field" value={form.weekday} onChange={(event) => onChange({ ...form, weekday: event.target.value })}>{weekDays.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label><span className="form-label">Início</span><input type="time" className="input-field" value={form.startTime} onChange={(event) => onChange({ ...form, startTime: event.target.value })} required /></label><label><span className="form-label">Fim</span><input type="time" className="input-field" value={form.endTime} onChange={(event) => onChange({ ...form, endTime: event.target.value })} required /></label></div><div className="grid grid-cols-2 gap-3"><label><span className="form-label">Duração</span><select className="input-field" value={form.duration} onChange={(event) => onChange({ ...form, duration: event.target.value })}><option value="20">20 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></label><label><span className="form-label">Atendimento</span><select className="input-field" value={form.type} onChange={(event) => onChange({ ...form, type: event.target.value as 'inperson' | 'online' })}><option value="inperson">Presencial</option><option value="online">Online</option></select></label></div><button className="btn btn-primary w-full flex items-center justify-center gap-2"><Plus size={17} /> Adicionar horário</button></form></section><section className="bg-white border border-slate-200 rounded-2xl p-6"><h2 className="text-lg font-semibold">Horários cadastrados</h2><div className="mt-5 space-y-3">{availability.length === 0 ? <EmptyState text="Nenhum horário cadastrado." /> : availability.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-4"><div><p className="font-semibold text-sm">{doctors.find((doctor) => doctor.id === item.doctor_id)?.name}</p><p className="text-sm text-slate-500 mt-1">{weekDays.find((day) => day.value === item.weekday)?.label} · {formatTime(item.start_time)} – {formatTime(item.end_time)} · {item.slot_duration_minutes} min</p></div><div className="flex items-center gap-3"><span className="text-xs font-semibold text-[#087b63]">{item.location_type === 'online' ? 'Online' : 'Presencial'}</span><button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600"><X size={16} /></button></div></div>)}</div></section></div>; }

function ContentManager({ content, posts, selectedContent, selectedPost, onSelectContent, onSelectPost, onNewPost, onSaveContent, onSavePost }: { content: SiteContent[]; posts: BlogPost[]; selectedContent: SiteContent | null; selectedPost: BlogPost | null; onSelectContent: (item: SiteContent | null) => void; onSelectPost: (item: BlogPost | null) => void; onNewPost: () => void; onSaveContent: (event: FormEvent<HTMLFormElement>) => void; onSavePost: (event: FormEvent<HTMLFormElement>) => void }) { return <div className="grid xl:grid-cols-[0.7fr_1.3fr] gap-6"><section className="space-y-5"><div className="bg-white border border-slate-200 rounded-2xl p-6"><div className="flex justify-between items-center mb-5"><div><h2 className="font-semibold">Páginas públicas</h2><p className="text-sm text-slate-500 mt-1">Edite os textos principais da presença digital.</p></div><Settings2 size={19} className="text-slate-400" /></div><div className="space-y-2">{content.map((item) => <button key={item.id} onClick={() => { onSelectContent(item); onSelectPost(null); }} className={`w-full text-left p-4 rounded-xl border transition-colors ${selectedContent?.id === item.id ? 'border-[#087b63] bg-[#f1f9f6]' : 'border-slate-100 hover:border-slate-200'}`}><p className="font-semibold text-sm">{item.title}</p><p className="text-xs text-slate-500 mt-1">/{item.slug}</p></button>)}</div></div><div className="bg-white border border-slate-200 rounded-2xl p-6"><div className="flex justify-between items-center mb-5"><div><h2 className="font-semibold">Blog</h2><p className="text-sm text-slate-500 mt-1">Publique conteúdos de saúde.</p></div><button onClick={onNewPost} className="p-2 rounded-lg bg-[#e9f4f0] text-[#087b63]"><Plus size={17} /></button></div><div className="space-y-2">{posts.map((post) => <button key={post.id} onClick={() => { onSelectPost(post); onSelectContent(null); }} className={`w-full text-left p-4 rounded-xl border transition-colors ${selectedPost?.id === post.id ? 'border-[#087b63] bg-[#f1f9f6]' : 'border-slate-100 hover:border-slate-200'}`}><div className="flex justify-between gap-3"><p className="font-semibold text-sm truncate">{post.title}</p><span className={`text-[10px] uppercase font-bold ${post.published ? 'text-emerald-600' : 'text-slate-400'}`}>{post.published ? 'Publicado' : 'Rascunho'}</span></div><p className="text-xs text-slate-500 mt-1">{post.author_name}</p></button>)}</div></div></section><section className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[420px]">{selectedContent && <form onSubmit={onSaveContent} className="space-y-5"><EditorHeading title="Editar página" subtitle={`Conteúdo público /${selectedContent.slug}`} /><label><span className="form-label">Título</span><input className="input-field" value={selectedContent.title} onChange={(event) => onSelectContent({ ...selectedContent, title: event.target.value })} /></label><label><span className="form-label">Introdução</span><textarea className="input-field min-h-24" value={selectedContent.intro} onChange={(event) => onSelectContent({ ...selectedContent, intro: event.target.value })} /></label><label><span className="form-label">Texto principal</span><textarea className="input-field min-h-44" value={selectedContent.body} onChange={(event) => onSelectContent({ ...selectedContent, body: event.target.value })} /></label><button className="btn btn-primary flex items-center gap-2"><Save size={17} /> Salvar alterações</button></form>}{selectedPost && <form onSubmit={onSavePost} className="space-y-5"><EditorHeading title={selectedPost.id ? 'Editar artigo' : 'Novo artigo'} subtitle="O conteúdo publicado aparece no blog da clínica." /><label><span className="form-label">Título</span><input className="input-field" value={selectedPost.title} onChange={(event) => onSelectPost({ ...selectedPost, title: event.target.value })} required /></label><label><span className="form-label">Resumo</span><textarea className="input-field min-h-24" value={selectedPost.excerpt} onChange={(event) => onSelectPost({ ...selectedPost, excerpt: event.target.value })} /></label><label><span className="form-label">Conteúdo</span><textarea className="input-field min-h-56" value={selectedPost.content} onChange={(event) => onSelectPost({ ...selectedPost, content: event.target.value })} /></label><label><span className="form-label">Autor</span><input className="input-field" value={selectedPost.author_name} onChange={(event) => onSelectPost({ ...selectedPost, author_name: event.target.value })} /></label><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={selectedPost.published} onChange={(event) => onSelectPost({ ...selectedPost, published: event.target.checked })} /> Publicar no site</label><button className="btn btn-primary flex items-center gap-2"><Save size={17} /> Salvar artigo</button></form>}{!selectedContent && !selectedPost && <div className="h-full flex items-center justify-center text-center text-slate-400"><div><FilePenLine size={28} className="mx-auto mb-4" /><p className="font-semibold text-slate-600">Selecione um conteúdo para editar</p><p className="text-sm mt-2">As alterações ficam prontas para publicação no site.</p></div></div>}</section></div>; }
function EditorHeading({ title, subtitle }: { title: string; subtitle: string }) { return <div className="mb-7"><h2 className="text-xl font-semibold">{title}</h2><p className="text-sm text-slate-500 mt-1">{subtitle}</p></div>; }

function DoctorForm({ form, onChange, onSubmit, onClose }: { form: { name: string; crm: string; specialty: string; email: string; password: string; photoUrl: string }; onChange: (value: typeof form) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) { return <div className="fixed inset-0 z-50 bg-[#061724]/60 p-4 flex items-center justify-center"><div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8"><div className="flex items-start justify-between mb-7"><div><p className="text-sm font-semibold text-[#087b63] uppercase tracking-wider">Equipe médica</p><h2 className="text-2xl font-semibold mt-2">Cadastrar médico</h2><p className="text-sm text-slate-500 mt-2">O acesso criado aqui poderá entrar apenas na própria agenda.</p></div><button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700"><X size={20} /></button></div><form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4"><label><span className="form-label">Nome completo</span><input className="input-field" value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} required /></label><label><span className="form-label">CRM</span><input className="input-field" placeholder="CRM/UF" value={form.crm} onChange={(event) => onChange({ ...form, crm: event.target.value })} required /></label><label><span className="form-label">Especialidade</span><input className="input-field" value={form.specialty} onChange={(event) => onChange({ ...form, specialty: event.target.value })} required /></label><label><span className="form-label">Foto (URL)</span><input className="input-field" type="url" value={form.photoUrl} onChange={(event) => onChange({ ...form, photoUrl: event.target.value })} /></label><label><span className="form-label">E-mail de acesso</span><input className="input-field" type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} required /></label><label><span className="form-label">Senha provisória</span><input className="input-field" type="password" minLength={6} value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} required /></label><div className="sm:col-span-2 mt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button><button className="btn btn-primary flex items-center gap-2"><UserRound size={17} /> Criar acesso</button></div></form></div></div>; }

export default AdminPage;
