import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import TodoList from './TodoList';
import { Task, TaskStatus } from './interface';

const meta: Meta<typeof TodoList> = {
  title: 'Components/TodoList',
  component: TodoList,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof TodoList>;

const TaskManagerDemo: React.FC = () => {
  const [originalTasks] = useState<Task[]>([
    { id: '1', description: '任务一任务一任务一任务一任务一', status: 'done' },
    { id: '2', description: '任务二任务二任务二任务二任务二', status: 'done' },
    { id: '3', description: '任务三任务三任务三任务三任务三', status: 'todo' },
    { id: '4', description: '任务四任务四任务四任务四任务四', status: 'todo' }
  ]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(originalTasks);

  const handleSearchTask = (keyword: string) => {
    const filtered = originalTasks.filter((task) => task.description.includes(keyword));
    setFilteredTasks(filtered);
  };

  const handleAddTask = (task: Task) => {
    setFilteredTasks([task, ...filteredTasks]);
  };

  const handleDeleteTask = (taskId: string) => {
    setFilteredTasks(filteredTasks.filter((task) => task.id !== taskId));
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setFilteredTasks(
      filteredTasks.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  return (
    <TodoList
      tasks={filteredTasks}
      onSearchTask={handleSearchTask}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      onUpdateTaskStatus={handleUpdateTaskStatus}
    />
  );
};

export const Default: Story = {
  render: () => <TaskManagerDemo />
};
