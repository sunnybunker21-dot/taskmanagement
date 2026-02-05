
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setLanguage, logout } from '../redux/authSlice';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="h-16 glass fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8 border-b border-white/5">
      <div className="flex items-center gap-4 text-slate-400">
        <span className="text-sm font-medium">Nexus &gt; Dashboard</span>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => dispatch(setLanguage(language === 'en' ? 'hi' : 'en'))}
          className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold hover:bg-slate-700 transition-colors uppercase"
        >
          {language === 'en' ? 'हिन्दी' : 'English'}
        </button>

        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
