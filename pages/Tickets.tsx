
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setTickets } from '../redux/ticketSlice';
import { api } from '../services/api';
import { translations } from '../utils/i18n';
import { Ticket, TicketStatus, Role } from '../types';

const Tickets: React.FC = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state: RootState) => state.ticket);
  const { user, language } = useSelector((state: RootState) => state.auth);
  const t = translations[language];
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);

  const canCreateTicket = user && [Role.ADMIN, Role.AGENT, Role.SALES].includes(user.role);
  const canAssignTicket = user && [Role.ADMIN, Role.TASK_ASSIGNER, Role.MANAGEMENT].includes(user.role);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await api.get<Ticket[]>('/tickets');
        dispatch(setTickets(data));
      } catch (e) {
        dispatch(setTickets([
          { id: '1', title: 'Payment Gateway Error', description: 'User unable to pay', status: TicketStatus.NEW, priority: 'HIGH', createdBy: 'Agent 1', createdAt: new Date().toISOString() },
          { id: '2', title: 'Slow Load Times', description: 'Dashboard taking 5s+', status: TicketStatus.ASSIGNED, priority: 'MEDIUM', assignedTo: 'Dev John', createdBy: 'Manager A', createdAt: new Date().toISOString() },
          { id: '3', title: 'New Feature Request', description: 'Dark mode toggle', status: TicketStatus.RESOLVED, priority: 'LOW', assignedTo: 'Dev Sarah', createdBy: 'Sales B', createdAt: new Date().toISOString() },
        ]));
      }
    };
    fetchTickets();
  }, [dispatch]);

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    api.put(`/tickets/${ticketId}/status`, { status: newStatus }).then(() => {
      const updated = tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t);
      dispatch(setTickets(updated));
    });
  };

  const handleAssign = (ticketId: string, assignee: string) => {
    api.post(`/tickets/${ticketId}/assign`, { assignee }).then(() => {
      const updated = tickets.map(t => t.id === ticketId ? { ...t, assignedTo: assignee, status: TicketStatus.ASSIGNED } : t);
      dispatch(setTickets(updated));
      setShowAssignModal(null);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/20';
      case 'MEDIUM': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/20';
    }
  };

  const filteredTickets = filter === 'ALL' ? tickets : tickets.filter(tk => tk.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.tickets}</h1>
          <p className="text-slate-400 mt-1">Manage and resolve customer support tickets</p>
        </div>
        {canCreateTicket && (
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
            <span className="text-xl">+</span> {t.createTicket}
          </button>
        )}
      </div>

      <div className="flex gap-2 p-1 glass rounded-2xl w-fit overflow-x-auto max-w-full">
        {['ALL', ...Object.values(TicketStatus)].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filter === status ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => {
          const isAssignee = user?.name === ticket.assignedTo;
          const isManager = [Role.ADMIN, Role.MANAGEMENT, Role.TASK_ASSIGNER].includes(user?.role as Role);
          const canManageStatus = isAssignee || isManager;

          return (
            <div key={ticket.id} className="glass p-6 rounded-3xl group flex flex-col hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className="text-slate-500 text-[10px] font-mono">#{ticket.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{ticket.description}</p>
              
              <div className="space-y-4">
                {canAssignTicket && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowAssignModal(showAssignModal === ticket.id ? null : ticket.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-700"
                    >
                      {ticket.assignedTo ? 'Change Assignee' : 'Assign to Staff'}
                    </button>
                    {showAssignModal === ticket.id && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 glass border border-slate-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                        {['Dev John', 'Dev Sarah', 'Agent Smith'].map(staff => (
                          <button 
                            key={staff}
                            onClick={() => handleAssign(ticket.id, staff)}
                            className="w-full p-3 text-left text-xs text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            {staff}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {canManageStatus && (
                  <div className="flex gap-2">
                    <select 
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                      className="flex-1 bg-slate-900 border border-slate-700 text-[10px] font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-white/5">
                      {ticket.assignedTo ? ticket.assignedTo.charAt(0) : '?'}
                    </div>
                    <span className="text-xs text-slate-400 truncate max-w-[100px]">{ticket.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className={`text-[10px] uppercase font-bold tracking-widest ${ticket.status === TicketStatus.RESOLVED ? 'text-green-500' : 'text-slate-600'}`}>
                    {ticket.status}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tickets;
