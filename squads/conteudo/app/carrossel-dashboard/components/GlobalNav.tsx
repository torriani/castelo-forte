import React from 'react';
import { 
  Box, 
  Command, 
  Compass, 
  Crown, 
  Layers, 
  LayoutDashboard, 
  Library, 
  Zap 
} from 'lucide-react';

export const GlobalNav: React.FC = () => {
  const menuItems = [
    { icon: Crown, label: 'Cultura Lendária' },
    { icon: Zap, label: 'Desafios' },
    { icon: Compass, label: 'Mentes Sintéticas' },
    { icon: Box, label: 'Curador[IA]' },
    { icon: LayoutDashboard, label: 'Gerador de Carrossel', active: true },
    { icon: Command, label: 'Prompt Ops' },
  ];

  return (
    <aside className="w-64 bg-black border-r border-white/5 flex flex-col h-full flex-shrink-0">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <span className="text-white font-bold tracking-wider text-sm">Lendar[IA]OS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              item.active 
              ? 'bg-[#18181b] text-[#d4b995] font-medium' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="pt-6 pb-2 px-3">
          <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Creator OS</span>
        </div>
        
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-zinc-500 hover:text-white text-sm">
          <Library className="w-4 h-4" />
          <span>Meus Cursos</span>
        </button>
         <button className="w-full flex items-center space-x-3 px-3 py-2 text-zinc-500 hover:text-white text-sm">
          <Layers className="w-4 h-4" />
          <span>Blog / CMS</span>
        </button>

      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
          <div className="flex flex-col">
            <span className="text-xs text-white font-medium">Usuário Pro</span>
            <span className="text-[10px] text-zinc-500">Free Plan</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
