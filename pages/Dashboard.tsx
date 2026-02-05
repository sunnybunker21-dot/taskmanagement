
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { api } from '../services/api';
import { translations } from '../utils/i18n';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 65 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 90 },
];

const Dashboard: React.FC = () => {
  const { language } = useSelector((state: RootState) => state.auth);
  const t = translations[language];
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setStats(res);
      } catch (e) {
        // Mock data if API fails
        setStats({
          totalTickets: 128,
          openTickets: 12,
          activeChats: 5,
          assignedTasks: 8,
          staffOnline: 14,
          performance: 92
        });
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: t.totalTickets, value: stats.totalTickets, icon: '🎫', color: 'bg-blue-600' },
    { title: t.openTickets, value: stats.openTickets, icon: '🔥', color: 'bg-red-500' },
    { title: t.activeChats, value: stats.activeChats, icon: '💬', color: 'bg-green-500' },
    { title: t.assignedTasks, value: stats.assignedTasks, icon: '✅', color: 'bg-purple-500' },
    { title: t.onlineStaff, value: stats.staffOnline, icon: '👥', color: 'bg-cyan-500' },
    { title: t.performance, value: `${stats.performance}%`, icon: '📈', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-3xl hover:translate-y-[-4px] transition-transform duration-300">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-4 shadow-lg`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Efficiency Trends
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Resolution Volume
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
