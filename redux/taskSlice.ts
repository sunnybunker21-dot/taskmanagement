
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../types';

interface TaskState {
  myTasks: Task[];
}

const initialState: TaskState = {
  myTasks: [],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setMyTasks: (state, action: PayloadAction<Task[]>) => {
      state.myTasks = action.payload;
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const task = state.myTasks.find(t => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
  },
});

export const { setMyTasks, updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
