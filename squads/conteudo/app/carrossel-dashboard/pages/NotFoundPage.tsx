import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icone 404 */}
        <div className="mb-8">
          <span className="text-8xl font-bold text-zinc-800 select-none">404</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Pagina nao encontrada
        </h1>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          A pagina que voce esta procurando nao existe ou foi movida.
          Verifique a URL ou volte para a tela inicial.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Ir para Projetos
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
