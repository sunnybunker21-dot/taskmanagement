
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Role } from '../types';
import { translations } from '../utils/i18n';

const Sidebar: React.FC = () => {
  const { user, language } = useSelector((state: RootState) => state.auth);
  const t = translations[language];

  const menuItems = [
    { name: t.dashboard, path: '/', icon: '🏠', roles: Object.values(Role) },
    { name: t.liveChat, path: '/chat', icon: '💬', roles: [Role.ADMIN, Role.AGENT, Role.SALES] },
    { name: t.tickets, path: '/tickets', icon: '🎫', roles: [Role.ADMIN, Role.AGENT, Role.TASK_ASSIGNER, Role.DEVELOPER, Role.MANAGEMENT] },
    { name: t.tasks, path: '/tasks', icon: '✅', roles: [Role.ADMIN, Role.TASK_ASSIGNER, Role.DEVELOPER, Role.MANAGEMENT] },
    { name: t.staff, path: '/staff', icon: '👨‍💼', roles: [Role.ADMIN] },
  ];

  return (
    <aside className="w-64 glass h-screen fixed left-0 top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">N</div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">NEXUS</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.filter(item => user && item.roles.includes(user.role)).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold uppercase">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
