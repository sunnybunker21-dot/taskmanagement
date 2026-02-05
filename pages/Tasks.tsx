
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setMyTasks, updateTaskStatus } from '../redux/taskSlice';
import { api } from '../services/api';
import { translations } from '../utils/i18n';
import { Task, TaskStatus, Role } from '../types';

const Tasks: React.FC = () => {
  const dispatch = useDispatch();
  const { myTasks } = useSelector((state: RootState) => state.task);
  const { user, language } = useSelector((state: RootState) => state.auth);
  const t = translations[language];

  const canCreateTask = user && [Role.ADMIN, Role.TASK_ASSIGNER, Role.MANAGEMENT].includes(user.role);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.get<Task[]>('/tasks/my');
        dispatch(setMyTasks(data));
      } catch (e) {
        dispatch(setMyTasks([
          { id: 't1', title: 'Fix Header Blur', description: 'Blur not working on Safari', status: TaskStatus.TODO, assignedBy: 'Manager X', assignedTo: 'Me', createdAt: '' },
          { id: 't2', title: 'Update API Docs', description: 'Document new chat endpoints', status: TaskStatus.DOING, assignedBy: 'Admin', assignedTo: 'Me', createdAt: '' },
          { id: 't3', title: 'Design Refresh', description: 'Glassmorphism implementation', status: TaskStatus.DONE, assignedBy: 'Manager Y', assignedTo: 'Me', createdAt: '' },
        ]));
      }
    };
    fetchTasks();
  }, [dispatch]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    dispatch(updateTaskStatus({ id: taskId, status }));
    api.put(`/tasks/${taskId}/status`, { status }).catch(() => {});
  };

  const columns = [
    { title: 'Todo', status: TaskStatus.TODO, color: 'bg-slate-700' },
    { title: 'In Progress', status: TaskStatus.DOING, color: 'bg-blue-600' },
    { title: 'Completed', status: TaskStatus.DONE, color: 'bg-green-600' }
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t.tasks}</h1>
        {canCreateTask && (
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
            <span>+</span> {t.createTask}
          </button>
        )}
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div 
            key={col.status} 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
            className="w-96 min-w-[24rem] flex flex-col glass rounded-3xl p-4 bg-slate-900/10"
          >
            <div className="flex items-center gap-3 mb-6 px-2">
              <span className={`w-3 h-3 rounded-full ${col.color}`}></span>
              <h2 className="font-bold text-slate-300 uppercase tracking-widest text-sm">{col.title}</h2>
              <span className="ml-auto bg-slate-800 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-500">
                {myTasks.filter(t => t.status === col.status).length}
              </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {myTasks.filter(t => t.status === col.status).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                  className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 cursor-grab active:cursor-grabbing transition-all shadow-lg"
                >
                  <h3 className="font-bold text-slate-100 mb-2">{task.title}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{task.description}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-mono">
                    <span>By {task.assignedBy}</span>
                    <span>Task ID: {task.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
