import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const SignupPage: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas nao coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await signUp(email, password, nome || undefined);

    if (signUpError) {
      setError(signUpError);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <span className="text-emerald-400 text-2xl">&#10003;</span>
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Conta criada!</h2>
          <p className="text-zinc-500 text-xs mb-6">
            Verifique seu email para confirmar a conta. Depois, faca login.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-lg font-bold text-sm bg-white text-black hover:bg-gray-100 transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white font-bold tracking-wider text-sm uppercase">
            Carrossel Studio
          </h1>
          <p className="text-zinc-600 text-xs mt-2">Criar nova conta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="Minimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1.5">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="Repita a senha"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all ${
              isLoading
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                <span>Criando...</span>
              </div>
            ) : (
              'Criar Conta'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-zinc-600 text-xs">
            Ja tem conta?{' '}
            <Link to="/login" className="text-white hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
