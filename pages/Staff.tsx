
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { api } from '../services/api';
import { User, Role } from '../types';

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const isAdmin = currentUser?.role === Role.ADMIN;

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await api.get<User[]>('/staff');
        setStaff(data);
      } catch (e) {
        setStaff([
          { id: '1', name: 'Admin One', email: 'admin@nexus.com', role: Role.ADMIN, status: 'ONLINE' },
          { id: '2', name: 'Agent Smith', email: 'smith@nexus.com', role: Role.AGENT, status: 'BUSY' },
          { id: '3', name: 'John Dev', email: 'john@nexus.com', role: Role.DEVELOPER, status: 'OFFLINE' },
          { id: '4', name: 'Manager Sarah', email: 'sarah@nexus.com', role: Role.TASK_ASSIGNER, status: 'ONLINE' },
        ]);
      }
    };
    fetchStaff();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'BUSY': return 'bg-red-500';
      default: return 'bg-slate-600';
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    if (!isAdmin) return;
    api.put(`/staff/${id}/role`, { role: newRole }).then(() => {
      setStaff(prev => prev.map(s => s.id === id ? { ...s, role: newRole as Role } : s));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-slate-400 mt-1">Configure roles and permissions for your team</p>
        </div>
        {isAdmin && (
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
            Add Staff Member
          </button>
        )}
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-700">
                <th className="px-8 py-5 font-semibold">User</th>
                <th className="px-8 py-5 font-semibold">Role</th>
                <th className="px-8 py-5 font-semibold">Status</th>
                <th className="px-8 py-5 font-semibold">Activity</th>
                {isAdmin && <th className="px-8 py-5 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {staff.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {isAdmin ? (
                      <select 
                        defaultValue={user.role}
                        className="bg-slate-900 border border-slate-700 text-xs font-bold px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-lg text-slate-400 uppercase tracking-tighter">
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(user.status)} shadow-[0_0_8px] ${user.status === 'ONLINE' ? 'shadow-green-500/50' : user.status === 'BUSY' ? 'shadow-red-500/50' : ''}`}></span>
                      <span className="text-xs font-bold text-slate-400">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <p className="text-xs text-slate-500">Last active 2m ago</p>
                  </td>
                  {isAdmin && (
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Staff;
