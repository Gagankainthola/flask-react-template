import React, { useState } from 'react';
import { useTaskContext } from 'frontend/contexts/task.provider';
import Button from 'frontend/components/button';
import FormControl from 'frontend/components/form-control';

export const TasksPage: React.FC = () => {
  const { tasks, isLoading, addTask, deleteTask, updateTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!title) return;

    await addTask({
      title,
      description,
      active: true,
      account_id: '', // Backend se account_id token me aa raha hai
    });

    setTitle('');
    setDescription('');
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await updateTask(id, { active: !active });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      {/* Add Task Form */}
      <div className="mb-4">
        <FormControl label="Title">
          <input
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl label="Description">
          <input
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <Button onClick={handleAdd}>Add Task</Button>
      </div>

      {isLoading && <p>Loading...</p>}

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-2 border flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{task.title}</p>
              <p className="text-sm">{task.description}</p>
              <p className="text-xs text-gray-500">
                {task.active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="space-x-2">
              <Button onClick={() => handleToggleActive(task._id, task.active)}>
                Toggle Active
              </Button>
              <Button onClick={() => deleteTask(task._id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
