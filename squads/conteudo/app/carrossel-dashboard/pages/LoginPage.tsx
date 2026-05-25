import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
      setIsLoading(false);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white font-bold tracking-wider text-sm uppercase">
            Carrossel Studio
          </h1>
          <p className="text-zinc-600 text-xs mt-2">Entre na sua conta</p>
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
              autoComplete="current-password"
              className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
              placeholder="Sua senha"
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
                <span>Entrando...</span>
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-zinc-600 text-xs">
            Nao tem conta?{' '}
            <Link to="/signup" className="text-white hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
