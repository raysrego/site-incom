import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { session, profile, loading, signIn, signUp, claimInitialAdmin } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session && profile) {
      navigate('/admin', { replace: true });
    }
  }, [navigate, profile, session]);

  if (loading) {
    return <div className="min-h-screen bg-[#061724]" />;
  }

  if (session && profile) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, fullName);

    if (result) {
      setError(result);
    } else if (mode === 'signup') {
      setMessage('Acesso criado. Entre com seus dados para continuar e configurar o primeiro administrador.');
      setMode('login');
    }
    setIsSubmitting(false);
  };

  const handleClaimAdmin = async () => {
    setIsSubmitting(true);
    setError(null);
    const result = await claimInitialAdmin();
    if (result) setError(result);
    else setMessage('Acesso administrativo ativado. Você será direcionado ao painel.');
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#061724] text-white flex items-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <section className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-20">
            <ArrowLeft size={18} /> Voltar ao site
          </Link>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[#66c4a6] text-sm font-semibold uppercase tracking-[0.18em]">
              <ShieldCheck size={18} /> Área segura da clínica
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight leading-tight">Gestão clínica com mais clareza e cuidado.</h1>
            <p className="mt-6 text-lg leading-8 text-white/65">Organize a equipe, receba agendamentos e conduza suas consultas online em um único ambiente.</p>
            <div className="mt-12 flex items-center gap-5 text-white/65">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center"><Stethoscope size={23} /></div>
              <p className="text-sm leading-6">Acesso individual para administradores e médicos, com permissões próprias para cada função.</p>
            </div>
          </div>
        </section>

        <section className="bg-white text-[#102b3d] rounded-[28px] p-6 sm:p-10 shadow-2xl">
          <img src="/Logo_Incom_branca_(1).png" alt="Incom" className="h-12 w-auto object-contain object-left bg-[#061724] rounded-xl px-4 py-2" />
          <div className="mt-10">
            <p className="text-sm font-semibold text-[#087b63] uppercase tracking-[0.16em]">Portal da equipe</p>
            <h2 className="mt-3 text-3xl font-semibold">{mode === 'login' ? 'Entrar no painel' : 'Criar primeiro acesso'}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{mode === 'login' ? 'Use o acesso da clínica para acompanhar sua operação.' : 'O primeiro cadastro pode ativar o administrador inicial da clínica.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === 'signup' && (
              <label className="block">
                <span className="form-label">Nome completo</span>
                <input className="input-field" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              </label>
            )}
            <label className="block">
              <span className="form-label">E-mail profissional</span>
              <input className="input-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="block">
              <span className="form-label">Senha</span>
              <input className="input-field" type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>

            {error && <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
            {message && <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>}

            <button className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
              {isSubmitting ? 'Aguarde...' : mode === 'login' ? 'Entrar no ambiente' : 'Criar acesso'}
              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          {mode === 'login' && (
            <button type="button" onClick={() => setMode('signup')} className="mt-6 w-full text-center text-sm font-semibold text-[#087b63] hover:text-[#065b4b]">
              Primeiro acesso da clínica
            </button>
          )}
          {mode === 'signup' && (
            <button type="button" onClick={() => setMode('login')} className="mt-6 w-full text-center text-sm font-semibold text-[#087b63] hover:text-[#065b4b]">
              Já tenho acesso
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-2">
            <LockKeyhole size={15} /> Seus dados de acesso são protegidos pela autenticação segura da clínica.
          </div>
          {session && !profile && (
            <button type="button" onClick={handleClaimAdmin} className="mt-4 text-sm text-[#087b63]">Ativar administrador inicial</button>
          )}
        </section>
      </div>
    </main>
  );
};

export default AuthPage;
