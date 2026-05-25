import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AppHeader: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isAdmin = profile?.plano === 'admin';

  const navItems = [
    { path: '/editor', label: 'Editor', icon: LayoutDashboard },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: Settings }] : []),
  ];

  return (
    <header className="h-12 bg-[#09090b] border-b border-white/5 flex items-center px-5 shrink-0">
      {/* Logo */}
      <button
        onClick={() => navigate('/editor')}
        className="text-white font-bold tracking-wider text-xs uppercase mr-8 hover:text-zinc-300 transition-colors"
      >
        Carrossel Studio
      </button>

      {/* Nav */}
      <nav className="flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs transition-colors ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-[9px] text-zinc-400 font-bold uppercase">
                {(profile?.nome || profile?.email || 'U')[0]}
              </span>
            </div>
          )}
          <span className="text-xs text-zinc-400">
            {profile?.nome || profile?.email || 'Usuario'}
          </span>
          <span className="text-[9px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded uppercase font-bold">
            {profile?.plano || 'free'}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center space-x-1.5 px-2 py-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
          title="Sair"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="text-[10px]">Sair</span>
        </button>
      </div>
    </header>
  );
};
