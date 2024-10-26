export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
}

export interface TodoListProps {
  tasks: Task[];
  onSearchTask: (keyword: string) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}
