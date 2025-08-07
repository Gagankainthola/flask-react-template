import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

type Task = {
  _id: string;
  title: string;
  description?: string;
  active: boolean;
  account_id: string; 
  created_at: string;
  updated_at: string;
};

type Nullable<T> = T | null;


class TaskService {
  async getTasks() {
    return { data: [] as Task[] };
  }
  
  async createTask(task: Omit<Task, '_id' | 'created_at' | 'updated_at'>) {
    return { 
      data: { 
        ...task, 
        _id: Math.random().toString(36).substr(2, 9), 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      } as Task 
    };
  }
  
  async updateTask(taskId: string, task: Partial<Task>) {
    return { data: { _id: taskId, ...task } as Task };
  }
  
  async deleteTask(taskId: string) {
    console.log(`Deleting task with ID: ${taskId}`);
    return { success: true };
  }
}

type TaskContextType = {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, '_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

const TaskContext = createContext<Nullable<TaskContextType>>(null);

const taskService = new TaskService();

export const useTaskContext = (): TaskContextType =>
  useContext(TaskContext) as TaskContextType;

export const TaskProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await taskService.getTasks();
      // Agar response array nahi hai toh default []
      setTasks(Array.isArray(res.data) ? res.data : []);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, '_id' | 'created_at' | 'updated_at'>) => {
    const res = await taskService.createTask(task);
    if (res.data) setTasks((prev) => [...prev, res.data]);
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    const res = await taskService.updateTask(id, task);
    if (res.data) {
      const updatedTask = res.data;
      setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
    }
  };

  const deleteTask = async (taskId: string) => {
    await taskService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, fetchTasks, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export type { Task };