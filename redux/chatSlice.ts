
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setChats, setActiveChat, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
