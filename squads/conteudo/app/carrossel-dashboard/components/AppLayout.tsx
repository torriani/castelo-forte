import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans text-gray-100">
      <AppHeader />
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
