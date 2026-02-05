
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setChats, setActiveChat, setMessages, addMessage } from '../redux/chatSlice';
import { api } from '../services/api';
import { translations } from '../utils/i18n';
import { Chat, Message } from '../types';

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const { chats, activeChat, messages } = useSelector((state: RootState) => state.chat);
  const { user, language } = useSelector((state: RootState) => state.auth);
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMyChats = async () => {
      try {
        const data = await api.get<Chat[]>('/chat/my');
        dispatch(setChats(data));
      } catch (e) {
        // Mocking
        dispatch(setChats([
          { id: '1', participants: [{ name: 'Alex' } as any], lastMessage: 'Hey, I need help!', unreadCount: 2 },
          { id: '2', participants: [{ name: 'Sarah' } as any], lastMessage: 'Problem resolved, thanks.', unreadCount: 0 }
        ]));
      }
    };
    fetchMyChats();
  }, [dispatch]);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const data = await api.get<Message[]>(`/chat/messages/${activeChat.id}`);
          dispatch(setMessages(data));
        } catch (e) {
          dispatch(setMessages([
            { id: 'm1', chatId: activeChat.id, senderId: 'customer', text: 'Hello! I am having issues with my order.', timestamp: new Date().toISOString(), isRead: true },
            { id: 'm2', chatId: activeChat.id, senderId: user?.id || 'agent', text: 'Hi! Let me look into that for you.', timestamp: new Date().toISOString(), isRead: true },
          ]));
        }
      };
      fetchMessages();
      api.post(`/chat/${activeChat.id}/read`, {}).catch(() => {});
    }
  }, [activeChat, dispatch, user?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      chatId: activeChat.id,
      senderId: user?.id || 'agent',
      text: inputText,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    dispatch(addMessage(newMessage));
    setInputText('');

    try {
      await api.post(`/chat/messages/${activeChat.id}`, { text: inputText });
    } catch (e) {
      console.error('Failed to send message');
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] glass rounded-3xl flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">{t.activeChats}</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => dispatch(setActiveChat(chat))}
              className={`w-full p-4 flex gap-4 hover:bg-slate-800/50 transition-colors ${activeChat?.id === chat.id ? 'bg-blue-600/10 border-l-4 border-blue-600' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold">
                {chat.participants[0]?.name.charAt(0)}
              </div>
              <div className="text-left overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm text-slate-200">{chat.participants[0]?.name}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full">{chat.unreadCount}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                {activeChat.participants[0]?.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-100">{activeChat.participants[0]?.name}</h3>
                <p className="text-[10px] text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => api.post(`/chat/close/${activeChat.id}`, {}).then(() => dispatch(setActiveChat(null)))}
              className="text-slate-400 hover:text-red-400 text-sm font-medium"
            >
              Close Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${msg.senderId === user?.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className="flex items-center gap-2 mt-2 opacity-50 text-[10px]">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.senderId === user?.id && msg.isRead && <span>• {t.read}</span>}
                  </div>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-800 flex gap-4">
            <input
              type="text"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder={`${t.search}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
              {t.send}
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
          <div className="text-6xl">💬</div>
          <p className="text-lg">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
