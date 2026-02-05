
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '../types';

interface TicketState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
}

const initialState: TicketState = {
  tickets: [],
  selectedTicket: null,
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
  },
});

export const { setTickets, setSelectedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
