import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, CameraOff, Copy, Mic, MicOff, PhoneOff, ShieldCheck, UserRound, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Appointment } from '../lib/database.types';

interface AppointmentRoom extends Appointment {
  doctors: { name: string; specialty: string } | null;
}

const TelemedicinePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [appointment, setAppointment] = useState<AppointmentRoom | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/acesso', { replace: true });
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!id || !user) return;
    supabase.from('appointments').select('*, doctors(name, specialty)').eq('id', id).maybeSingle().then(({ data, error: queryError }) => {
      if (queryError || !data) {
        console.error('telemedicine appointment load failed', queryError);
        setError('Não foi possível abrir esta consulta.');
      } else {
        setAppointment(data as unknown as AppointmentRoom);
      }
    });
  }, [id, user]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
      setMicOn(true);
    } catch (cameraError) {
      console.error('camera access failed', cameraError);
      setError('A câmera e o microfone precisam ser liberados no navegador para iniciar a consulta.');
    }
  };

  const toggleMic = () => {
    const nextMicState = !micOn;
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = nextMicState; });
    setMicOn(nextMicState);
  };

  const copyRoom = async () => {
    if (!appointment?.meeting_room_id) return;
    await navigator.clipboard.writeText(appointment.meeting_room_id);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1800);
  };

  if (authLoading || !appointment) return <div className="min-h-screen bg-[#061724] flex items-center justify-center text-white/60">Abrindo sala segura...</div>;

  return <main className="min-h-screen bg-[#061724] text-white p-4 sm:p-6"><div className="max-w-7xl mx-auto"><header className="flex items-center justify-between gap-4 mb-8"><Link to="/admin" className="inline-flex items-center gap-2 text-white/65 hover:text-white text-sm"><ArrowLeft size={17} /> Voltar ao painel</Link><div className="inline-flex items-center gap-2 text-xs text-white/60"><ShieldCheck size={16} className="text-[#66c4a6]" /> Sala protegida da Incom</div></header><div className="flex flex-col lg:flex-row justify-between gap-5 mb-7"><div><p className="text-sm uppercase tracking-[0.16em] text-[#66c4a6]">Teleconsulta</p><h1 className="text-3xl font-semibold mt-2">{appointment.patient_name}</h1><p className="text-white/55 mt-2">{appointment.doctors?.name} · {appointment.doctors?.specialty}</p></div><div className="flex items-center gap-3"><div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"><span className="text-white/45">Código da sala</span><span className="ml-3 font-mono text-[#a9e2d0]">{appointment.meeting_room_id?.slice(0, 10) ?? 'gerando'}</span></div><button onClick={copyRoom} className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" title="Copiar código"><Copy size={17} /></button></div></div><div className="grid lg:grid-cols-[1fr_320px] gap-5"><section className="relative aspect-video rounded-2xl overflow-hidden bg-[#102b3d] border border-white/10"><video ref={videoRef} autoPlay muted playsInline className={`h-full w-full object-cover ${cameraOn ? 'block' : 'hidden'}`} /><div className={`${cameraOn ? 'hidden' : 'flex'} absolute inset-0 flex-col items-center justify-center text-center`}><div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center"><UserRound size={30} className="text-white/55" /></div><p className="mt-5 font-semibold">Sua câmera está desligada</p><p className="mt-2 text-sm text-white/45">Ative a câmera para iniciar o atendimento.</p></div><div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs text-white/75"><span className={`h-2 w-2 rounded-full ${cameraOn ? 'bg-emerald-400' : 'bg-white/30'}`} /> Você</div><div className="absolute right-4 top-4 rounded-xl bg-black/30 p-3"><Video size={18} className="text-white/70" /></div></section><aside className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-white/45">Resumo do atendimento</p><div className="mt-5 space-y-4 text-sm"><div><p className="text-white/45">Data e horário</p><p className="mt-1 font-semibold">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(`${appointment.appointment_date}T12:00:00`))}</p><p className="mt-1 text-[#a9e2d0]">{appointment.start_time.slice(0, 5)} – {appointment.end_time.slice(0, 5)}</p></div><div><p className="text-white/45">Telefone</p><p className="mt-1">{appointment.patient_phone}</p></div><div><p className="text-white/45">Convênio</p><p className="mt-1">{appointment.patient_insurance}</p></div></div><div className="mt-8 pt-5 border-t border-white/10"><p className="text-xs leading-5 text-white/45">O ambiente está preparado para vídeo e áudio no navegador. A conexão entre paciente e médico deve ser ativada com sinalização WebRTC e token de sala em uma próxima etapa de produção.</p></div></aside></div>{error && <div className="mt-5 rounded-xl bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-200">{error}</div>}{isCopied && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white text-[#102b3d] px-4 py-2 text-sm shadow-xl">Código copiado</div>}<div className="mt-5 flex justify-center gap-3"><button onClick={toggleMic} className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-white/10 hover:bg-white/15' : 'bg-red-500 text-white'}`} title={micOn ? 'Desligar microfone' : 'Ligar microfone'}>{micOn ? <Mic size={19} /> : <MicOff size={19} />}</button><button onClick={toggleCamera} className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${cameraOn ? 'bg-[#087b63] hover:bg-[#096b57]' : 'bg-white/10 hover:bg-white/15'}`} title={cameraOn ? 'Desligar câmera' : 'Ligar câmera'}>{cameraOn ? <Camera size={19} /> : <CameraOff size={19} />}</button><button onClick={() => navigate('/admin')} className="h-12 px-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center gap-2 font-semibold text-sm"><PhoneOff size={18} /> Encerrar</button></div></div></main>;
};

export default TelemedicinePage;
