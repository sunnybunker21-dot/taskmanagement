
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { setUser, setLoading } from './redux/authSlice';
import { api } from './services/api';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/Chat';
import Tickets from './pages/Tickets';
import Tasks from './pages/Tasks';
import Staff from './pages/Staff';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await api.get<any>('/auth/me');
        dispatch(setUser(userData));
      } catch (err) {
        // Not logged in or session expired
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/staff" element={<Staff />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
