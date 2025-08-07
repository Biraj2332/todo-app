import { createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/axiosInstance';

const loadTasksFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('tasks');
    if (serializedState === null) {
      return {
        all: [],
        active: [],
        completed: [],
        lastSync: null,
        isOnline: navigator.onLine,
        initialized: false
      };
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error("Could not load tasks from localStorage", e);
    return {
      all: [],
      active: [],
      completed: [],
      lastSync: null,
      isOnline: navigator.onLine,
      initialized: false
    };
  }
};

const saveTasksToLocalStorage = (state) => {
  try {
    const stateToSave = {
      all: state.all,
      active: state.active,
      completed: state.completed,
      lastSync: state.lastSync,
      isOnline: state.isOnline,
      initialized: state.initialized
    };
    localStorage.setItem('tasks', JSON.stringify(stateToSave));
  } catch (e) {
    console.error("Could not save tasks to localStorage", e);
  }
};

const initialState = loadTasksFromLocalStorage();

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTaskLocal: (state, action) => {
      const newTask = {
        ...action.payload,
        date: action.payload.date || new Date().toLocaleDateString('en-CA'),
        time: action.payload.time || new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        completed: false,
      };
      state.all.unshift(newTask);
      state.active.unshift(newTask);
      saveTasksToLocalStorage(state);
    },
    deleteTaskLocal: (state, action) => {
      const { id } = action.payload;
      state.all = state.all.filter(task => task.id !== id);
      state.active = state.active.filter(task => task.id !== id);
      state.completed = state.completed.filter(task => task.id !== id);
      saveTasksToLocalStorage(state);
    },
    updateTaskLocal: (state, action) => {
      const { id, title, date, time, completed } = action.payload;
      const taskIndex = state.all.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.all[taskIndex] = {
          ...state.all[taskIndex],
          title: title || state.all[taskIndex].title,
          date: date || state.all[taskIndex].date,
          time: time || state.all[taskIndex].time,
          completed: completed !== undefined ? completed : state.all[taskIndex].completed
        };
        
        state.active = state.all.filter(task => !task.completed);
        state.completed = state.all.filter(task => task.completed);
        saveTasksToLocalStorage(state);
      }
    },
    reorderTasksLocal: (state, action) => {
      const { sourceCol, destCol, sourceIndex, destinationIndex } = action.payload;
      
      if (sourceCol === destCol) {
        const column = [...state[sourceCol]];
        const [removed] = column.splice(sourceIndex, 1);
        column.splice(destinationIndex, 0, removed);
        state[sourceCol] = column;
      } 
      else {
        const sourceColumn = [...state[sourceCol]];
        const destColumn = [...state[destCol]];
        const [removed] = sourceColumn.splice(sourceIndex, 1);
        
        const updatedTask = {
          ...removed,
          completed: destCol === 'completed'
        };
        
        destColumn.splice(destinationIndex, 0, updatedTask);
        state[sourceCol] = sourceColumn;
        state[destCol] = destColumn;
        
        state.all = state.all.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      }
      saveTasksToLocalStorage(state);
    },
    setNetworkStatus: (state, action) => {
      state.isOnline = action.payload;
      saveTasksToLocalStorage(state);
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
      saveTasksToLocalStorage(state);
    },
    syncTasks: (state, action) => {
      state.all = action.payload.all;
      state.active = action.payload.active;
      state.completed = action.payload.completed;
      state.lastSync = new Date().toISOString();
      state.initialized = true;
      saveTasksToLocalStorage(state);
    },
    setInitialized: (state) => {
      state.initialized = true;
      saveTasksToLocalStorage(state);
    }
  },
});

export const { 
  addTaskLocal, 
  deleteTaskLocal, 
  updateTaskLocal, 
  reorderTasksLocal,
  setNetworkStatus,
  setLastSync,
  syncTasks,
  setInitialized
} = taskSlice.actions;

export const addTask = (taskData) => async (dispatch) => {
  const task = {
    id: Date.now().toString(),
    title: taskData.title,
    date: taskData.date || new Date().toLocaleDateString('en-CA'),
    time: taskData.time || new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    completed: false
  };

  dispatch(addTaskLocal(task));

  if (navigator.onLine) {
    try {
      await axiosInstance.post('/api/tasks', task);
      dispatch(setLastSync(new Date().toISOString()));
    } catch (error) {
      console.error('Error adding task to server:', error);
    }
  }
};

export const fetchTasks = () => async (dispatch) => {
  if (navigator.onLine) {
    try {
      const response = await axiosInstance.get('/api/tasks');
      dispatch(syncTasks({
        all: response.data,
        active: response.data.filter(task => !task.completed),
        completed: response.data.filter(task => task.completed)
      }));
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      dispatch(setInitialized());
    }
  } else {
    dispatch(setInitialized());
  }
};

export const deleteTask = (id) => async (dispatch) => {
  dispatch(deleteTaskLocal({ id }));

  if (navigator.onLine) {
    try {
      await axiosInstance.delete(`/api/tasks/${id}`);
      dispatch(setLastSync(new Date().toISOString()));
    } catch (error) {
      console.error('Error deleting task from server:', error);
    }
  }
};

export const updateTask = (id, updates) => async (dispatch) => {
  dispatch(updateTaskLocal({ id, ...updates }));

  if (navigator.onLine) {
    try {
      await axiosInstance.put(`/api/tasks/${id}`, updates);
      dispatch(setLastSync(new Date().toISOString()));
    } catch (error) {
      console.error('Error updating task on server:', error);
    }
  }
};

export const reorderTasks = (result) => async (dispatch, getState) => {
  const { source, destination } = result;
  if (!destination) return;

  dispatch(reorderTasksLocal({
    sourceCol: source.droppableId,
    destCol: destination.droppableId,
    sourceIndex: source.index,
    destinationIndex: destination.index
  }));

  const state = getState().tasks;
  const task = state[destination.droppableId][destination.index];
  
  if (source.droppableId !== destination.droppableId && navigator.onLine) {
    try {
      await axiosInstance.put(`/api/tasks/${task.id}`, {
        completed: destination.droppableId === 'completed'
      });
      dispatch(setLastSync(new Date().toISOString()));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }
};

export const initializeApp = () => async (dispatch) => {
  const localTasks = loadTasksFromLocalStorage();
  
  if (localTasks.all.length > 0) {
    dispatch(syncTasks({
      all: localTasks.all,
      active: localTasks.active,
      completed: localTasks.completed
    }));
  }

  if (navigator.onLine) {
    await dispatch(fetchTasks());
  } else {
    dispatch(setInitialized());
  }
};

export default taskSlice.reducer;
